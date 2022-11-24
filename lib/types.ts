export interface IConfigObject {
    name: string,
    componentEntryPoint: string,
    component: {
      extension: string,
      suffixExtension: string,
      export?: string,
      path?: string
    },
    style: {
      extension: string,
      suffixExtension: string,
      import?: string,
      path?: string
    },
    test: {
      extension: string,
      suffixExtension: string,
      path?: string
    },
    props: {
      extension: string,
      suffixExtension: string,
      path?: string
    },
    fixture: {
      extension: string,
      suffixExtension: string,
      path?: string
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