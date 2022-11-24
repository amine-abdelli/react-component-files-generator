import inquirer from 'inquirer';

async function checkConfigFilePrompt() {
  const overwriteResponse = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'fileCheckboxes',
      message: 'What file would you like to set up for now ?',
      choices: ['Component', 'Stylesheet', 'Props', 'Test', 'Fixture'],
      default: ['Component', 'Stylesheet', 'Test']
    }
  ]);
  console.log('overwriteResponse', overwriteResponse)
  // ! SHOW Arborescence as usual
  // ! ./src/component/
  // !        - Component.component.tsx
  // !        - Component.module.ts
  return overwriteResponse;
}

export { checkConfigFilePrompt }; 