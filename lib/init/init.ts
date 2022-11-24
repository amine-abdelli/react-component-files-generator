import chalk from 'chalk';
import { doesConfigFileExists, isReactOrNextInstalled } from '../../utils';
import { checkConfigFilePrompt, triggerPromptOption } from './prompt';

const log = console.log;

function quitPrompt() {
  log(chalk.bold('Goodbye !'));
}

(async () => {
  if (isReactOrNextInstalled()) {
    return log(chalk.bold('No React or Next.js project could be found, please install one of theme before going further'));
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