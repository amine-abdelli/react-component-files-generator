import { doesConfigFileExists, isReactOrNextInstalled, log } from '../utils';
import { quitPrompt } from '../utils/prompt.utils';
import { checkConfigFilePrompt, triggerPromptOption } from './prompt.init';

(async () => {
  if (isReactOrNextInstalled()) {
    log('No React or Next.js project could be found, please install one of theme before going further');
  }
  if (doesConfigFileExists()) {
    const overwriteResponse = await checkConfigFilePrompt();
    if (overwriteResponse.overwrite) {
      triggerPromptOption();
    } else {
      // TODO: Add some cool emojis everywhere ;)
      log('Goodbye !');
      quitPrompt();
    }
  } else {
    triggerPromptOption();
  }
})();
