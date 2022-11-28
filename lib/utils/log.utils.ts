import chalk from 'chalk';
import { Colors } from '../constants/colors';

/**
 * Console log messages
 * @param message string
 * @param type 'error' | 'success' | 'warning'
 */
export function log(message: string, type?: 'error' | 'success' | 'warning') {
  let hex = '';
  if (type === 'error') hex = Colors.ERROR;
  if (type === 'success') hex = Colors.SUCCESS;
  if (type === 'warning') hex = Colors.WARNING;
  console.log(chalk.hex(hex).bold(message))
};