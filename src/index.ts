import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

async function run() {
  core.debug("Start");

  const token = core.getInput("github-token", { required: true });
  const octokit = github.getOctokit(token);

  const labelNames = await getPullRequestLabelNames(octokit);
  core.debug(`PR label names: ${labelNames}`);

  const labels = getInputLabels();
  core.debug(`Input labels: ${labels}`);

  const result = labels.every(
    (label) => labelNames.findIndex((value) => label === value) >= 0
  );
  core.setOutput("result", result);

  core.debug("End");
}

async function getPullRequestLabelNames(
  octokit: InstanceType<typeof GitHub>
): Promise<string[]> {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const commit_sha = github.context.sha;
  core.debug(
    `PR context - Owner: ${owner} Repo: ${repo} Commit_SHA: ${commit_sha}`
  );

  const response =
    await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner,
      repo,
      commit_sha,
    });
  core.debug(`Retrieved commit data: ${response.data}`);

  const pr = response.data.length > 0 && response.data[0];
  core.debug(`Retrieved PR: ${pr}`);

  return pr ? pr.labels.map((label) => label.name || "") : [];
}

function getInputLabels(): string[] {
  const raw = core.getInput("labels", { required: true });
  core.debug(`Get input "labels": ${raw}`);

  const json = JSON.parse(raw);
  core.debug(`Parsed as JSON: ${json}`);

  return Array.isArray(json) ? json : [];
}

run().catch((err) => {
  core.setFailed(`Action failed with error: ${err.message}`);
});
