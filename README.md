# Get PR action

This action check the PR labels contain given labels.

## Inputs

### `github-token`

**Required** The repository token, i.e. `secrets.GITHUB_TOKEN`

### `labels`

**Required** The array of label name

## Outputs

### `result`

The result whether the PR labels contain given labels

## Example usage

```
uses: shioyang/check-pr-labels-action@v1.0.0
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  labels: '["label-1", "label-2"]'
```
