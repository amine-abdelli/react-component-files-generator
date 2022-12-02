import inquirer from 'inquirer';
import { doesFileExists, log } from '../utils';
import { IConfigObject } from '../types';
import { defaultComponentEntryPointPath } from '../constants/path';

async function componentBuildPrompt(configRest: IConfigObject, componentEntryPoint: string) {
  const classifiedResponse: any[] = [];
  const { fileCheckboxes, chosenComponentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'chosenComponentName',
      message: 'Choose a component name:',
      validate(input, answers?) {
        if(!new RegExp(/^[A-Z]+$/i).test(input)) {
          log('')
          log('Component name can only includes alphabetic characters, please try again !', 'error');
          return false;
        }
        return true
      },
    },
    {
      type: 'confirm',
      name: 'shouldContinue',
      message: 'This component already exists and will be erase if you continue. Are sure you want to go further ?',
      when({chosenComponentName}) {
        if(doesFileExists(chosenComponentName, configRest.component?.path || componentEntryPoint || `${defaultComponentEntryPointPath}`)) {
          return true;
        }
        return false;
      },
      default: false
    },
    {
      type: 'checkbox',
      name: 'fileCheckboxes',
      message: 'What file would you like to set up for now ?',
      choices({ chosenComponentName }) {
        return Object.entries(configRest).map(([key, value]) => {
          classifiedResponse.push({ name: `${chosenComponentName}${value.nameExtension || value.extension}`, type: key})
          return `${chosenComponentName}${value.nameExtension || value.extension}`;
        })
      },
      default({ chosenComponentName }: { chosenComponentName: string}) {
        return Object.values(configRest).slice(0, 3).map(({ nameExtension, extension }: any) => {
          return `${chosenComponentName}${nameExtension || extension}`
        })
      },
      when({ shouldContinue, chosenComponentName }) {
        if(shouldContinue || !doesFileExists(chosenComponentName, configRest.component?.path || configRest.componentEntryPoint || './src/components')) return true;
        return false;
      }
    }
  ]);
  // ! SHOW Arborescence as usual
  // ! ./src/component/
  // !        - Component.component.tsx
  // !        - Component.module.ts
  return { 
    promptResponse: classifiedResponse.filter(({ name }) => fileCheckboxes.includes(name)),
    chosenComponentName 
  };
}

export { componentBuildPrompt }; 