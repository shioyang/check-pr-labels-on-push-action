
import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import Joi from 'joi';

async function run() {
    //const token = core.getInput("github-token", { required: true });
    const config = getConfig();
    const octokit = github.getOctokit(config['github-token']);

    const labelNames = await getPullRequestLabelNames(octokit);

    const labels = getInputLabels();
    const result = labels.every(
        (label) => labelNames.findIndex((value) => label === value) >= 0
    );
    core.setOutput("result", result);
    core.setOutput("labels", labelNames);
}

async function getPullRequestLabelNames(
    octokit: InstanceType<typeof GitHub>
): Promise<string[]> {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const commit_sha = github.context.sha;

    const response =
        await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha,
        });

    const pr = response.data.length > 0 && response.data[0];
    return pr ? pr.labels.map((label) => label.name || "") : [];
}

function getInputLabels(): string[] {
    const raw = core.getInput("labels", { required: true });
    const json = JSON.parse(raw);
    return Array.isArray(json) ? json : [];
}

function getConfig() {
    const input = Object.fromEntries(
      Object.keys(configSchema.describe().keys).map(item => [
        item,
        core.getInput(item)
      ])
    );
  
    const {error, value} = configSchema.validate(input, {abortEarly: false});
    if (error) {
      throw error;
    }
  
    return value;
  }

  const extendedJoi = Joi.extend(joi => {
    return {
      type: 'processOnly',
      base: joi.array(),
      coerce: {
        from: 'string',
        method(value) {
          value = value.trim();
  
          if (value) {
            value = value
              .split(',')
              .map(item => {
                item = item.trim();
                if (['issues', 'prs', 'discussions'].includes(item)) {
                  item = item.slice(0, -1);
                }
                return item;
              })
              .filter(Boolean);
          }
  
          return {value};
        }
      }
    };
  });

  const configSchema = Joi.object({
    'github-token': Joi.string().trim().max(100),
  
    'config-path': Joi.string()
      .trim()
      .max(200)
      .default('.github/label-actions.yml'),
  
    'process-only': Joi.alternatives().try(
      extendedJoi
        .processOnly()
        .items(Joi.string().valid('issue', 'pr', 'discussion'))
        .min(1)
        .max(3)
        .unique(),
      Joi.string().trim().valid('')
    )
  });

run().catch((err) => {
    core.setFailed(err.message);
});
