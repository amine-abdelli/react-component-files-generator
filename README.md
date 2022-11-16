## Install

```sh
npm install react-folder-structure-builder
```

## Init
```sh
rcfs --init
```
* All these questions will be asked only once
* [X] Check that a react or next app is installed
* [X] CLI will ask questions:
  * [X] Check if rfcs.config.json already exists...
    * Ask if they want to override
  * [X] What is the name of the project?
    * default to current directory name
  * [X] What type of project?
    * next
    * react
  * [ ] if react Do you use views in your project
  * [X] Which folder is the entry point of your components
    * default ./src/components
  * [X] .jsx .tsx .js .ts
  * [ ] Which folder is the entry point of your pages (for next js only)
  * [ ] Which folder is the entry point of your global stylesheet (press N if you wish not to import anything in your stylesheets)
  * [X] css or scss or less or style component ?
    * [ ] CSS
    * [ ] SCSS
    * [ ] LESS
    * [ ] styledcomponent ?
  * [X] Do you use module css or normal css, if you don't know press N ? // Or GO and look in package.json if more than one library ask what library is used
  * [X] What testing library are you currently using // Or GO and look in package.json if more than one library ask what library is used
    * [ ] Jest
    * [ ] Mocha
  * [ ] Jest
  * [X] Would you like to give a suffix to your components ?
    * default MyComponent.component.tsx
    * default MyComponent.style.tsx
    * default MyComponent.props.tsx
    * default MyComponent.fixture.tsx
    * default MyComponent.spec.tsx
* Create config file

## 

```sh
rcfs --build [component-name]
```
* if no component-name options
* [X] Chose a name for your component
  * [ ] Do you need style ?
  * [ ] Do you need prop file ? 
  * [ ] Do you need test file ?

```sh
rcfs --help
```

```sh
rcfs --update
```