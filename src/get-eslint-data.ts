import parser from "@typescript-eslint/parser";
import { TSESLint } from "@typescript-eslint/utils";
import { Linter } from "@typescript-eslint/utils/dist/ts-eslint";
import { Logger } from "./logger";

export function getEslintData(
  eslintConfig: Linter.Config,
  workspaceRoot: string,
  log: Logger
) {
  const linter = new TSESLint.Linter();
  const noRestrictedImportsRuleName = "no-restricted-imports";

  if (!eslintConfig.overrides) {
    log(`Could not find overrides in eslint config`);
    return;
  }

  let foundRuleEntry: Linter.RuleEntry | undefined;

  for (const override of eslintConfig.overrides) {
    if (override.rules && noRestrictedImportsRuleName in override.rules) {
      foundRuleEntry = override.rules[noRestrictedImportsRuleName];
    }
  }

  if (!foundRuleEntry) {
    log(`Could not find ${noRestrictedImportsRuleName} in eslint config`);
    return;
  }

  const baseConfig = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018 as const,
      sourceType: "module" as const,
    },
    rules: {
      [noRestrictedImportsRuleName]: foundRuleEntry,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).workspaceRoot = workspaceRoot;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).projectPath = workspaceRoot;

  linter.defineParser("@typescript-eslint/parser", parser);

  return {
    linter,
    baseConfig,
  };
}
