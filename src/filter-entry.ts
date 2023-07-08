import ts from 'typescript/lib/tsserverlibrary';
import { TSESLint } from '@typescript-eslint/utils';
import { Linter } from '@typescript-eslint/utils/dist/ts-eslint';

export function filterEntry(
  entry: ts.CompletionEntry,
  linter: TSESLint.Linter,
  baseConfig: Linter.Config,
  fileName: string
) {
  const canBeImported = entry.kindModifiers === 'export';

  if (canBeImported) {
    const failures = linter.verify(
      `
      import '${entry.source}';
      import('${entry.source}');
     `,
      baseConfig,
      fileName
    );

    return failures.length === 0;
  }

  return true;
}
