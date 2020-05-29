# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

https://help.github.com/en/actions/creating-actions/creating-a-javascript-action

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```
uses: actions/hello-world-javascript-action@v1
with:
  who-to-greet: 'Mona the Octocat'
```
