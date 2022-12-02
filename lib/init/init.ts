
import { doesConfigFileExists, isReactOrNextInstalled, log } from '../utils';
import { filewalker } from '../utils/path.utils';
import { quitPrompt } from '../utils/prompt.utils';
import { checkConfigFilePrompt, triggerPromptOption } from './prompt.init';

export async function runInit() {
  if (!isReactOrNextInstalled()) {
    return log('No React or Next.js project could be found in your dependencies, please install one of theme before going further');
  }
  if (doesConfigFileExists()) {
    const overwriteResponse = await checkConfigFilePrompt();
    if (overwriteResponse.overwrite) {
      triggerPromptOption();
    } else {
      // TODO: Add some cool emojis :D
      log('Goodbye !');
      quitPrompt();
    }
  } else {
    triggerPromptOption();
  }
};
