import { IPromptResponse } from "../lib/types"

function formatResponseObjectToConfigFile({
  componentFileExtension, projectName,
  componentSuffixFileExtension, styleSheetFileExtension, styleSheetFileSuffixExtension, testingFileExtension, componentEntryPoint
}: IPromptResponse) {
  const deductedExtension: '.ts' | '.js' = (componentFileExtension === '.tsx' || componentFileExtension === '.ts') ? '.ts' : '.js'
  return {
    name: projectName,
    componentEntryPoint: componentEntryPoint,
    component: {
      extension: componentFileExtension,
      suffixExtension: componentSuffixFileExtension,
      export: 'module',
      // "path":            /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    },
    style: {
      extension: styleSheetFileExtension,
      suffixExtension: styleSheetFileSuffixExtension,
      import: 'default',
      // "path":            /* Specify a custom file folder path here (e.g ./theme/scss/) */
    },
    test: {
      extension: componentFileExtension,
      suffixExtension: testingFileExtension,
      // path:              /* Specify a custom file folder path here (e.g ./test/<%component_name%>/) */
    },
    props: {
      extension: deductedExtension,
      suffixExtension: `.props${deductedExtension}`,
      // path:              /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    },
    fixture: {
      extension: deductedExtension,
      suffixExtension: `.fixture${deductedExtension}`,
      // path:              /* Specify a custom file folder path here (e.g ./src/components/<%component_name%>/) */
    }
  }
}

export { formatResponseObjectToConfigFile };