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
  componentFileNameExtension: string,
  styleSheetFileExtension: string,
  styleSheetFileSuffixExtension: string,
  testingFileExtension: string,
}

export type CliOptionType = '--build' | '-b' | '--init' | '-i' | '--update' | '-u' | '--version' | '-v' | '--help' | '-h';