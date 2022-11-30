export interface IConfigObject {
    name: string,
    componentEntryPoint: string,
    component: {
      extension: string,
      nameExtension: boolean | string,
      export?: string,
      path?: string
    },
    style: {
      extension: string,
      nameExtension: boolean | string,
      import?: string,
      path?: string
    },
    test: {
      extension: string,
      nameExtension: boolean | string,
      path?: string
    },
    props: {
      extension: string,
      nameExtension: string,
      path?: string
    },
    fixture: {
      extension: string,
      nameExtension: string,
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