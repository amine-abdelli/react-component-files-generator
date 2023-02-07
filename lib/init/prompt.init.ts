import inquirer from 'inquirer';
import path from 'path';
import { findDependenciesFromJsonPackage, removeLeadingSlashes, writeJsonConfigFile } from '../utils';
import { formatResponseObjectToConfigFile } from '../utils/config.utils';
import { IPromptResponse } from '../types';

// Check if a config file already exists and ask for confirmation before erase it
async function checkConfigFilePrompt() {
  const overwriteResponse = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'rcfs.config.json already exists ! Would you like to overwrite it?',
      default: false
    }
  ])
  return overwriteResponse;
}

const CURRENT_WORKING_DIRECTORY = process.cwd();
// Get the working directory and keep the last name, e.g /home/workspace/my-project would return my-project
const defaultProjectName = path.basename(CURRENT_WORKING_DIRECTORY);

// Ask user questions to know its project better and build the config file
async function triggerPromptOption() {
  const promptResponse = await inquirer
    .prompt([
      {
        type: 'text',
        name: 'projectName',
        message: 'What is the name of the project ?',
        default: defaultProjectName,
      },
      {
        type: 'text',
        name: 'componentEntryPoint',
        message: 'Which folder is the entry point of your components? (by default "./src/components")',
        default: './src/components',
      },
      {
        type: 'list',
        name: 'componentFileExtension',
        message: 'What is the file extension of your components',
        choices: ['.jsx', '.tsx', '.js', '.ts'],
        default: findDependenciesFromJsonPackage('typescript') ? '.tsx' : '.jsx',
      },
      {
        type: 'list',
        name: 'componentFileNameExtension',
        message({ componentFileExtension }) {
          return `Choose a name extension for your component (e.g: ${`Button.component${componentFileExtension}, Button${componentFileExtension}`})`
        },
        choices({ componentFileExtension }) {
          return [`.component${componentFileExtension}`, 'none']
        },
        default: `.component${findDependenciesFromJsonPackage('typescript') ? '.tsx' : '.jsx'}`,
      },
      {
        type: 'list',
        name: 'styleSheetFileExtension',
        message: 'What styling technology do you use ? Enter N if ...',
        choices: ['.css', '.scss', '.less'],
        default: findDependenciesFromJsonPackage(['sass', 'less', 'scss']),
      },
      {
        type: 'list',
        name: 'styleSheetFileSuffixExtension',
        message: 'Choose a name extension for your style sheet (e.g: Button.style.scss)',
        choices({ styleSheetFileExtension, componentFileExtension }) {
          const styleSheetExtension = styleSheetFileExtension === 'styled component' ? componentFileExtension : styleSheetFileExtension;
          return [`.style${styleSheetExtension}`, `.module${styleSheetExtension}`, `.styled${styleSheetExtension}`, 'none']
        },
        default: 'Button.style.scss',
      },
      {
        type: 'list',
        name: 'testingFileExtension',
        message({ componentFileExtension }) {
          return `Choose a name extension for your testing file (e.g: Button.spec${componentFileExtension})`;
        },
        choices({ componentFileExtension }) {
          return [`.spec${componentFileExtension}`, `.test${componentFileExtension}`, 'none']
        },
        default: 'Button.test.scss',
      },
    ]);
  buildConfig(promptResponse)
}

// Build config file based on user's prompt response
async function buildConfig(promptResponse: IPromptResponse) {
  const { componentFileExtension, componentEntryPoint, componentFileNameExtension, styleSheetFileSuffixExtension, testingFileExtension, styleSheetFileExtension } = promptResponse;
  const BaseComponentName = 'Button';
  const deductedFileExtension = componentFileExtension === '.tsx' || componentFileExtension === '.ts' ? '.ts' : '.js';
  const overwriteResponse = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message() {
        return `Here is what your component folder will look like, but you will always have the option to select only those that you need ! Does that suit you ?
    ./${removeLeadingSlashes(componentEntryPoint)}/
          - ${BaseComponentName}${componentFileNameExtension === 'none' ? componentFileExtension : componentFileNameExtension}          (Component)
          - ${BaseComponentName}.props${deductedFileExtension}          (Props)
          - ${BaseComponentName}${styleSheetFileSuffixExtension === 'none' ? styleSheetFileExtension : styleSheetFileSuffixExtension}          (Style)
          - ${BaseComponentName}${testingFileExtension === 'none' ? componentFileExtension : testingFileExtension}          (Test)
          - ${BaseComponentName}.fixture${deductedFileExtension}          (Fixture)
        `;
      },
      default: true
    }
  ])
  if (overwriteResponse.overwrite) {
    const configObject = formatResponseObjectToConfigFile(promptResponse)
    writeJsonConfigFile(configObject);
  };
}

export { checkConfigFilePrompt, triggerPromptOption };