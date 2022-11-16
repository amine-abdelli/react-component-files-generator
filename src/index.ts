import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

function getProjectDependencies() {
  const JsonPackage = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
  return Object.keys({
    ...JsonPackage.dependencies,
    ...JsonPackage.devDependencies
  });
}

function isReactOrNextInstalled() {
  const dependencies = getProjectDependencies();
  return !!dependencies.filter((aDependency) => aDependency === 'next' || aDependency === 'react').length;
}

function doesConfigFileExists() {
  return fs.readdirSync('.').includes('rfcs.config.json');
}

// Also handle the case where 2 different libraries are installed e.g react and next.js
function findInJsonPackage(lib: string | string[]) {
  const dependencies = getProjectDependencies();
  if (typeof lib === 'string') {
    return dependencies.find((aDependency) =>  aDependency === lib);
  } else {
    for (const aLib of lib) {
      const foundDependency = dependencies.find((aDependency) => aDependency === aLib)
      if(foundDependency?.length) {
        return foundDependency;
      }
    }
  }
}
const CURRENT_WORKING_DIRECTORY = process.cwd();
// Get the working directory and keep the last name, e.g /home/workspace/my-project would return my-project
const defaultProjectName = path.basename(CURRENT_WORKING_DIRECTORY);
function quitPrompt() {
  console.log('Goodbye !');
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

async function buildConfig() {
  const isHumanResponse = await inquirer
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
    ]);
  console.log(isHumanResponse);
}
(async () => {
  if(!isReactOrNextInstalled()) {
    return console.log('No React or Next.js project could be found, please install one of theme before going further');
  }
  if (doesConfigFileExists()) {
    const overwriteResponse = await checkConfigFilePrompt();
    if (overwriteResponse.overwrite) {
      buildConfig();
    } else {
      quitPrompt();
    }
  } else {
    buildConfig();
  }
})()

// Use logger library to bring colors