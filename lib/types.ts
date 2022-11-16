export interface IConfigObject {
    name: string,
    componentEntryPoint: string,
    component: {
      extension: string,
      suffixExtension: string
    },
    style: {
      extension: string,
      suffixExtension: string
    },
    test: {
      extension: string,
      suffixExtension: string
    },
    props: {
      extension: string,
      suffixExtension: string
    },
    fixture: {
      extension: string,
      suffixExtension: string
    }
}

export interface IPromptResponse {
  projectName: string,
  projectType: string,
  componentEntryPoint: string,
  componentFileExtension: string,
  componentSuffixFileExtension: string,
  styleSheetFileExtension: string,
  styleSheetFileSuffixExtension: string,
  testingFileExtension: string,
}