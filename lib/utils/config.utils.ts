import { IConfigObject, IPromptResponse } from "../types"

// Build the config file object that will be then turned into a json file
function formatResponseObjectToConfigFile({
  componentFileExtension, projectName,
  componentFileNameExtension, styleSheetFileExtension, styleSheetFileSuffixExtension, testingFileExtension, componentEntryPoint
}: IPromptResponse) {
  const deductedExtension: '.ts' | '.js' = (componentFileExtension === '.tsx' || componentFileExtension === '.ts') ? '.ts' : '.js'
  return {
    name: projectName,
    componentEntryPoint: componentEntryPoint,
    component: {
      extension: componentFileExtension,
      nameExtension: componentFileNameExtension === 'none' ? false : componentFileNameExtension,
      export: 'module',
      // "path":            /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    },
    style: {
      extension: styleSheetFileExtension,
      nameExtension: styleSheetFileSuffixExtension === 'none' ? false : styleSheetFileSuffixExtension,
      module: false,
      // "path":            /* Specify a custom file folder path here (e.g ./theme/scss/) */
    },
    test: {
      extension: componentFileExtension,
      nameExtension: testingFileExtension === 'none' ? false : testingFileExtension,
      // path:              /* Specify a custom file folder path here (e.g ./test/<%component_name%>/) */
    },
    props: {
      extension: deductedExtension,
      nameExtension: `.props${deductedExtension}`,
      // path:              /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    },
    fixture: {
      extension: deductedExtension,
      nameExtension: `.fixture${deductedExtension}`,
      // path:              /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    }
  }
}

/**
 * Get the full file name based on what's passed via parameters
 * @param name component name
 * @param extension file extension
 * @returns a full file name (e.g Button.component.tsx)
 */
function getFullFileName(name: string, extension: string) {
  return `${name}${extension}`;
}

/**
 * Build an object with full file names based on config file (e.g. { ...FILE_NAMES, test: Button.test.tsx })
 * @param configFile 
 * @param componentName 
 * @returns an object filled with full file names
 */
function getFullFileNames(configFile: IConfigObject, componentName: string) {
  const FILE_NAMES: Record<string, string> = {};
  for(const [key, value] of Object.entries(configFile)) {
    FILE_NAMES[key] = getFullFileName(componentName, value.nameExtension || value.extension)
  }
  return FILE_NAMES;
}

export { formatResponseObjectToConfigFile, getFullFileNames, getFullFileName };