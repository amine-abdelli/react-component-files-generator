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
#### By default, components are generated in the same folder but you can change it by editing the config file:
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
