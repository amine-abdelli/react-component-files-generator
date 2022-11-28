
import { doesConfigFileExists, isReactOrNextInstalled, log } from '../utils';
import { filewalker } from '../utils/path.utils';
import { quitPrompt } from '../utils/prompt.utils';
import { checkConfigFilePrompt, triggerPromptOption } from './prompt.init';

(async () => {
  const foo = filewalker(process.cwd())
  console.log('foo', foo);
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
