import inquirer from 'inquirer';
import { doesFileExists } from '../../utils';
import { IConfigObject } from '../types';

async function componentBuildPrompt(configRest: IConfigObject) {
  // TODO: MAKE SURE USER CAN'T INTRODUCE SPACES
  const classifiedResponse: any[] = [];
  const { fileCheckboxes, chosenComponentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'chosenComponentName',
      message: 'Choose a component name:',
    },
    {
      type: 'confirm',
      name: 'shouldContinue',
      message: 'This component already exists and will be erase if you continue. Are sure you want to go further ?',
      // TODO: IF USER WANTS TO ERASE, DELETE FOLDER BEFORE RECREATING IT
      when({chosenComponentName}) {
        if(doesFileExists(chosenComponentName, configRest.component?.path || configRest.componentEntryPoint || `./src/components/`)) {
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
          classifiedResponse.push({ name: `${chosenComponentName}${value.suffixExtension}`, type: key})
          return `${chosenComponentName}${value.suffixExtension}`;
        })
      },
      default({ chosenComponentName }: { chosenComponentName: string}) {
        return Object.values(configRest).slice(0, 3).map(({ suffixExtension }: any) => {
          return `${chosenComponentName}${suffixExtension}`
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