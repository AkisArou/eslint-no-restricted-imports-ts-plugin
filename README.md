## Eslint no-restricted-imports ts service plugin

A typescript language service plugin, for filtering out symbols from editor completion, for libraries that fail the "no-restricted-imports" rule.
(In VSCode might need a "Typescript: Restart TS server")

#### Usage

You should have a valid eslint configuration file, that uses the "no-restricted-imports" eslint rule.

Installation:

```bash
npm i eslint-no-restricted-imports-ts-plugin
```

```json
// tsconfig.base.json

{
  "compilerOptions": {
    //...
    "plugins": [
      {
        "name": "eslint-no-restricted-imports-ts-plugin"
      }
    ]
  }
}
```

add the following into VSCode settings.json

```json
  "typescript.tsserver.pluginPaths": ["./node_modules"]
```
