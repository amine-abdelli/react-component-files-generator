
import { doesConfigFileExists, isReactOrNextInstalled, log } from '../utils';
import { quitPrompt } from '../utils/prompt.utils';
import { checkConfigFilePrompt, triggerPromptOption } from '../prompts/init.prompt';

export async function runInit() {
  if (!isReactOrNextInstalled() && process.env.NODE_ENV !== 'development') {
    return log('No React or Next.js project could be found in your dependencies, please install one of theme before going further');
  }
  if (doesConfigFileExists()) {
    const overwriteResponse = await checkConfigFilePrompt();
    if (overwriteResponse.overwrite) {
      triggerPromptOption();
    } else {
      log('Goodbye !');
      quitPrompt();
    }
  } else {
    triggerPromptOption();
  }
};
