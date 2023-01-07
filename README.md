# Check PR Labels on Push Action

This action check if given ALL labels have be applied to the PR when pushed.

## Inputs

### `github-token`

**Required** The repository token, i.e. `secrets.GITHUB_TOKEN`

### `labels`

**Required** The array of label name, e.g. `'["label-1", "label-2"]'`

## Outputs

### `result`

The result if given ALL labels have be applied to the PR

## Example Usage

```
uses: shioyang/check-pr-labels-on-push-action@v1.0.8
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  labels: '["label-1", "label-2"]'
```

### Example Workflow
e.g. [.github/workflows/main.yml](https://github.com/shioyang/check-pr-labels-on-push-action/blob/master/.github/workflows/main.yml)
```
on:
  push:
    branches:
      - master

jobs:
  check_pr_labels_job:
    runs-on: ubuntu-latest
    name: A job to check the PR labels contain given labels
    steps:
    - name: Check PR labels action step
      id: check_pr_labels
      uses: shioyang/check-pr-labels-on-push-action@v1.0.8
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        labels: '["enhancement"]'
      timeout-minutes: 5
    - name: See result
      run: echo "${{ steps.check_pr_labels.outputs.result }}"
```