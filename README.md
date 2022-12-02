# react-component-builder
## *react-component-builder* is a CLI tool helping developers creating react components faster with a simple command.
 
## Getting started
### Install rcb using npm :
```typescript
  npm install react-component-builder
```
### Init rcb to an existing react project running the following command:
```
  npx rcb --init
```
### You can now generate components by running:
```
  npx rcb --build
```

#### By default components are generated in the same folder but you can change it by editing config file as well as everything else:
```
|-- /src
    |-- /components
        |-- /Button
            |-- Button.component.js
            |-- Button.props.js
            |-- Button.style.scss
            |-- Button.test.js
```

## Config File

When you run --init for the first time, it will ask you a series of questions to customize the cli to your needs and will generate a "rcb.config.json" config file.

#### Example of the **rfsb.config.json** config file:

```json
{
    "name": "my project",
    "componentEntryPoint": "./src/components",
    "component": {
        "extension": ".tsx",
        "nameExtension": ".component.tsx",
        "export": "default"
    },
    "style": {
        "extension": ".less",
        "nameExtension": ".module.less",
        "module": true
    },
    "test": {
        "extension": ".tsx",
        "nameExtension": ".test.tsx"
    },
    "props": {
        "extension": ".ts",
        "nameExtension": ".props.ts"
    },
    "fixture": {
        "extension": ".ts",
        "nameExtension": ".fixture.ts"
    }
}
```
