import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { IConfigObject, IPromptResponse } from './types';

function getProjectDependencies() {
  const JsonPackage = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
  return Object.keys({
    ...JsonPackage.dependencies,
    ...JsonPackage.devDependencies
  });
}
function formatResponseObjectToConfigFile({
  componentFileExtension, projectName,
  componentSuffixFileExtension, styleSheetFileExtension, styleSheetFileSuffixExtension, testingFileExtension, componentEntryPoint
}: IPromptResponse) {
  const deductedExtension: '.ts' | '.js' = componentFileExtension === 'tsx' || componentFileExtension === 'ts' ? '.ts' : '.js'
  return {
    name: projectName,
    componentEntryPoint: componentEntryPoint,
    component: {
      extension: componentFileExtension,
      suffixExtension: componentSuffixFileExtension
    },
    style: {
      extension: styleSheetFileExtension,
      suffixExtension: styleSheetFileSuffixExtension
    },
    test: {
      extension: componentFileExtension,
      suffixExtension: testingFileExtension
    },
    props: {
      extension: deductedExtension,
      suffixExtension: `.props${deductedExtension}`
    },
    fixture: {
      extension: deductedExtension,
      suffixExtension: `.fixture${deductedExtension}`
    }
  }
}

function isReactOrNextInstalled() {
  const dependencies = getProjectDependencies();
  return !!dependencies.filter((aDependency) => aDependency === 'next' || aDependency === 'react').length;
}

function doesConfigFileExists() {
  return fs.readdirSync('.').includes('rfsb.config.json');
}

function quitPrompt() {
  console.log('Goodbye !');
}

// Also handle the case where 2 different libraries are installed e.g react and next.js
function findInJsonPackage(lib: string | string[]) {
  const dependencies = getProjectDependencies();
  if (typeof lib === 'string') {
    return dependencies.find((aDependency) => aDependency === lib);
  } else {
    for (const aLib of lib) {
      const foundDependency = dependencies.find((aDependency) => aDependency === aLib)
      if (foundDependency?.length) {
        return foundDependency;
      }
    }
  }
}

function writeJsonConfigFile(promptResponse: IConfigObject) {
  fs.writeFile("rfsb.config.json", JSON.stringify(promptResponse), 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("rfsb.config.json created successfully !");
  });
}

const CURRENT_WORKING_DIRECTORY = process.cwd();
// Get the working directory and keep the last name, e.g /home/workspace/my-project would return my-project
const defaultProjectName = path.basename(CURRENT_WORKING_DIRECTORY);

async function buildConfig(promptResponse: IPromptResponse) {
  const { componentFileExtension, componentSuffixFileExtension, styleSheetFileSuffixExtension, testingFileExtension } = promptResponse;
  const BaseComponentName = 'Button';
  const deductedFileExtension = componentFileExtension === 'tsx' || componentFileExtension === 'ts' ? '.ts' : '.js';
  const overwriteResponse = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message() {
        return `Here is what your component folder will look like, but you will always have the option to select only what you need ! Does that suit you ?
    ./src/component/
          - ${BaseComponentName}${componentSuffixFileExtension}
          - ${BaseComponentName}.props${deductedFileExtension}
          - ${BaseComponentName}${styleSheetFileSuffixExtension}
          - ${BaseComponentName}${testingFileExtension}
          - ${BaseComponentName}.fixture${deductedFileExtension}
        `;
      },
      default: true
    }
  ])
  if(overwriteResponse.overwrite) {
    const configObject = formatResponseObjectToConfigFile(promptResponse)
    writeJsonConfigFile(configObject);
  };
}

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
        type: 'list',
        name: 'projectType',
        message: 'Chose the correct framework ?',
        choices: ['React', 'Next.js'],
        default: findInJsonPackage(['react', 'next']) === 'react' ? 'React' : 'Next.js',
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
        default: findInJsonPackage('typescript') ? '.tsx' : '.jsx',
      },
      {
        type: 'list',
        name: 'componentSuffixFileExtension',
        message({ componentFileExtension }) {
          return `Would you like to add a suffix to your component ? (example: Button.component${componentFileExtension})`
        },
        choices({ componentFileExtension }) {
          return [`.component${componentFileExtension}`, 'none']
        },
        default: `.component${findInJsonPackage('typescript') ? '.tsx' : '.jsx'}`,
      },
      {
        type: 'list',
        name: 'styleSheetFileExtension',
        message: 'What styling technology do you use ? Enter N if ...',
        choices: ['.css', '.scss', '.less', 'styled component', 'none'],
        default: findInJsonPackage(['sass', 'less', 'scss', 'styled-component']),
      },
      {
        type: 'list',
        name: 'styleSheetFileSuffixExtension',
        message: 'What extension do you prefer ? (example: Button.style.scss)',
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
          return `Choose your prefered file extension ? (example: Button.spec${componentFileExtension})`;
        },
        choices({ componentFileExtension }) {
          return [`.spec${componentFileExtension}`, `.test${componentFileExtension}`, 'none']
        },
        default: 'Button.test.scss',
      },
    ]);

  buildConfig(promptResponse)
}
(async () => {
  if (!isReactOrNextInstalled()) {
    return console.log('No React or Next.js project could be found, please install one of theme before going further');
  }
  if (doesConfigFileExists()) {
    const overwriteResponse = await checkConfigFilePrompt();
    if (overwriteResponse.overwrite) {
      triggerPromptOption();
    } else {
      quitPrompt();
    }
  } else {
    triggerPromptOption();
  }
})()

// Use logger library to bring colors