import { CONFIG_FILE_NAME } from "../constants";

export function runHelp() {
  console.log(`
  Basic options:
    rcfg --help / -h             Show help.
    rcfg --init / -i             Run config initialization and creates a ${CONFIG_FILE_NAME} file.
    rcfg --version / -v          Output the version number.
    rcfg --build / -b            Build component.
    rcfg --update / -u           Update config.
  `)
}