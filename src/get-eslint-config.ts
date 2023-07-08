import path from 'path';
import fs from 'fs';
import { Linter } from '@typescript-eslint/utils/dist/ts-eslint';
import { parse } from 'jsonc-parser';
import { Logger } from './logger';

export function getEslintConfig(workspaceRoot: string, log: Logger) {
  const eslintConfigFiles = [
    '.eslintrc.json',
    '.eslintrc.js',
    '.eslintrc.cjs',
    'eslint.config.js',
  ];

  const foundEslintConfig = eslintConfigFiles.find((cf) =>
    fs.existsSync(path.join(workspaceRoot, cf))
  );

  if (!foundEslintConfig) {
    log('No eslint configuration file found');
    return;
  }

  const eslintConfig = parse(
    fs.readFileSync(path.join(workspaceRoot, foundEslintConfig), 'utf-8')
  ) as Linter.Config;

  log(`Found eslint config`);

  return eslintConfig;
}
