import ts from "typescript/lib/tsserverlibrary";
import { makeLogger } from "./logger";
import { filterEntry } from "./filter-entry";
import { getEslintData } from "./get-eslint-data";
import { getEslintConfig } from "./get-eslint-config";

function init(modules: {
  typescript: typeof import("typescript/lib/tsserverlibrary");
}) {
  const ts = modules.typescript;

  function create(info: ts.server.PluginCreateInfo) {
    const log = makeLogger(info);
    log(
      "Initializing no-restricted-imports eslint typescript language service plugin"
    );

    const { baseUrl } = info.project.getCompilerOptions();

    if (!baseUrl) {
      log("No baseUrl configured");
      return;
    }

    const workspaceRoot = ts.sys.resolvePath(baseUrl);

    log(`Workspace root -> ${workspaceRoot}`);

    const eslintConfig = getEslintConfig(workspaceRoot, log);

    if (!eslintConfig) {
      return;
    }

    const eslintData = getEslintData(eslintConfig, workspaceRoot, log);

    if (!eslintData) {
      return;
    }

    const proxy = getProxy(info);

    proxy.getCompletionsAtPosition = (fileName, position, options) => {
      const prior = info.languageService.getCompletionsAtPosition(
        fileName,
        position,
        options
      );

      if (!prior) return;

      prior.entries = prior.entries.filter((entry) =>
        filterEntry(entry, eslintData.linter, eslintData.baseConfig, fileName)
      );

      return prior;
    };

    return proxy;
  }

  return { create };
}

function getProxy(info: ts.server.PluginCreateInfo) {
  // Set up decorator object
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<
    keyof ts.LanguageService
  >) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const x = info.languageService[k]!;
    // @ts-expect-error - JS runtime trickery which is tricky to type tersely
    proxy[k] = (...args: Array<object>) => x.apply(info.languageService, args);
  }

  return proxy;
}

export = init;
