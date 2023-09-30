# react-component-files-generator

> **Warning**
> This documentation is still being drafted

### react-component-files-generator is a CLI tool helping developers creating react components faster with a simple command.

## Usage
### Install rcfg using npm :
```typescript
  npm install react-component-files-generator
```
### Init rcfg to an existing react project by running the following command:
```
  npx rcfg --init
```
![carbon](https://user-images.githubusercontent.com/77112257/205501760-78b104a0-013c-4074-baf0-10b7c98b3960.png)
#### By default, components are generated in the same folder but you can customize paths by adding `"path"` props in the config file:
```
|-- /src
    |-- /components
        |-- /Button
            |-- Button.component.js
            |-- Button.props.js
            |-- Button.style.scss
            |-- Button.test.js
```
### You can now generate components by running:
```
  npx rcfg --build
```
![carbon (3)](https://user-images.githubusercontent.com/77112257/205502405-ecd6bfb4-b694-4260-bf5c-d822f60a662a.png)

### Files generated are autofilled with generic content and the imports needed :
##### Component - (e.g. Button.component.tsx)
Imports are dynamically generated depending on files location in the file tree. 
```jsx
import React from 'react';
import './Button.module.scss';
import { ButtonProps } from './Button.props.ts';

const Button = (): ButtonProps => {
  return (
    <div>Button</div>
  )
}

export { Button };
```
##### Testing file - (e.g. Button.test.tsx)
```jsx
import { render } from '@testing-library/react';
import { Button } from './Button.component.tsx';

const component = () => {
    return <Button />;
};

describe('[Component] Button', () => {
    let container: any = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
        container = null;
    });

    it('should render Button component', () => {
        render(component(), container);
    });
})
```

## Config File

When you run --init for the first time, it will ask you a series of questions to customize the cli to your needs and will generate a "rcfg.config.json" config file.

#### Example of the **rcfg.config.json** config file:
Note that the path prop can handle this template `<%component_name%>` to dynamically create file in a folder holding the component name you're creating : 

Example for a Button.component.tsx component:
```"./src/style/<%component_name%>"```
```"./src/style/Button/Button.component.tsx"```

```json
{
    "name": "my project",
    "componentEntryPoint": "./src/components",
    "component": {
        "extension": ".tsx",
        "nameExtension": ".component.tsx",
        "export": "default" // For component file only
    },
    "style": {
        "extension": ".less",
        "nameExtension": ".module.less",
        "module": true, // For style file only
        "path": "./src/style/<%component_name%>"
    },
    "test": {
        "extension": ".tsx",
        "nameExtension": ".test.tsx",
        "path": "./src/__test__/<%component_name%>"
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

# Config options

### `extension` (required)
- Type: `string`
- Example value: `.js`, `.jsx`, `.ts`, `.tsx`, `.scss`, `.less`, ... 
This value must start with a dot.

### `nameExtension` (required)
- Type: `string`
- Example value: `.component.tsx`, `.props.js`, `.module.css`, `null`, ...
This value must start with a dot.

### `module` (optional) - For style file only
 - Type: `boolean`
 - Value: `true`, `false`

### `export` (optional) - For component only
export { Component }; OR export default Component;

### `path` (optional) - For component only
You can specify a path where you want to create your files in. Paths will be dynamically generated depending on where other files are located. You can also chose to create your file in a folder holding the component name using the <%component_name%> template.
 - Type: `string`
 - Example value: `./src/__test__/<%component_name%>`, `src/style`, ...
 - Example output: `./src/__test__/Button/Button.props.ts`, `src/style/Button.props`
 
