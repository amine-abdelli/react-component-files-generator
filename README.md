# react-folder-structure-builder

react-folder-structure-builder is a simple library helping you creating react components faster with a simple command.

## Getting started
### Install rfsb using npm :
```
  npm install --save-dev rfsb
```
### Init rfsb to an existing react project running the following command:
```
  rfsb init
```
### You can now generate components by running:
```
  rfsb build
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

When you run init rfsb within your project the first time, it will ask you a series of questions to customize the cli for your project needs (this will create a "rfsb.config.json" config file).

#### Example of the **rfsb.config.json** config file:

```json
{
    "name": "my project",
    "componentEntryPoint": "./src/components",
    "component": {
        "extension": ".tsx",
        "nameExtension": ".component.tsx",
        "export": "module"
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
