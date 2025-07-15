#!/usr/bin/env bun

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

interface ExportInfo {
  file: string;
  name: string;
  line: number;
  isTypeOnly: boolean;
}

interface ImportInfo {
  file: string;
  name: string;
  source: string;
  line: number;
  isTypeOnly: boolean;
}

async function findAllFiles(dir: string, extension: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules"
      ) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

async function analyzeFile(
  filePath: string,
): Promise<{ exports: ExportInfo[]; imports: ImportInfo[] }> {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const relativePath = filePath.replace("src/", "");

  const exports: ExportInfo[] = [];
  const imports: ImportInfo[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Skip comments and empty lines
    if (line.startsWith("//") || line.startsWith("/*") || !line) continue;

    // Analyze exports (skip re-exports for now)
    if (line.startsWith("export ") && !line.includes(" from ")) {
      // export const/let/var/function/class/interface/type
      const declarationMatch = line.match(
        /^export\s+(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/,
      );
      if (declarationMatch) {
        const isTypeOnly =
          line.includes("interface") ||
          line.includes("type ") ||
          line.includes("enum");
        exports.push({
          file: relativePath,
          name: declarationMatch[1],
          line: lineNumber,
          isTypeOnly,
        });
      }

      // export { name1, name2 }
      const namedExportMatch = line.match(
        /^export\s+(?:type\s+)?{([^}]+)}(?!\s+from)/,
      );
      if (namedExportMatch) {
        const isTypeOnly = line.includes("export type");
        const names = namedExportMatch[1]
          .split(",")
          .map((n) => n.trim().replace(/\s+as\s+\w+/, ""));

        for (const name of names) {
          if (name) {
            exports.push({
              file: relativePath,
              name: name.trim(),
              line: lineNumber,
              isTypeOnly,
            });
          }
        }
      }
    }

    // Analyze imports
    if (line.startsWith("import ")) {
      // import { name1, name2 } from "module"
      const namedImportMatch = line.match(
        /^import\s+(?:type\s+)?{([^}]+)}\s+from\s+["']([^"']+)["']/,
      );
      if (namedImportMatch) {
        const isTypeOnly = line.includes("import type");
        const names = namedImportMatch[1]
          .split(",")
          .map((n) => n.trim().replace(/\s+as\s+\w+/, ""));
        const source = namedImportMatch[2];

        for (const name of names) {
          if (name) {
            imports.push({
              file: relativePath,
              name: name.trim(),
              source,
              line: lineNumber,
              isTypeOnly,
            });
          }
        }
      }
    }
  }

  return { exports, imports };
}

async function main() {
  const files = await findAllFiles("src", ".ts");

  const allExports: ExportInfo[] = [];
  const allImports: ImportInfo[] = [];

  for (const file of files) {
    const { exports, imports } = await analyzeFile(file);
    allExports.push(...exports);
    allImports.push(...imports);
  }

  console.log("=== CORE-ENGINE EXPORT ANALYSIS ===\n");
  console.log(`Total files analyzed: ${files.length}`);
  console.log(`Total exports found: ${allExports.length}`);
  console.log(`Total imports found: ${allImports.length}\n`);

  // Find unused exports
  const unusedExports: ExportInfo[] = [];

  for (const exportInfo of allExports) {
    // Check if this export is imported anywhere
    const isUsed = allImports.some((importInfo) => {
      // Handle relative imports
      const resolvedSource = resolveImportPath(
        importInfo.source,
        importInfo.file,
      );
      const exportFilePath = exportInfo.file;

      return (
        (resolvedSource === exportFilePath ||
          resolvedSource === exportFilePath.replace(/\.ts$/, "") ||
          resolvedSource + ".ts" === exportFilePath) &&
        importInfo.name === exportInfo.name
      );
    });

    if (!isUsed) {
      unusedExports.push(exportInfo);
    }
  }

  if (unusedExports.length > 0) {
    console.log("=== UNUSED EXPORTS ===");
    for (const unused of unusedExports) {
      console.log(
        `${unused.file}:${unused.line} - ${unused.name}${unused.isTypeOnly ? " (type)" : ""}`,
      );
    }
    console.log(`\nTotal unused exports: ${unusedExports.length}`);
  } else {
    console.log("No unused exports found!");
  }
}

function resolveImportPath(importPath: string, fromFile: string): string {
  if (importPath.startsWith(".")) {
    // Relative import
    const fromDir = fromFile.split("/").slice(0, -1).join("/");
    const resolved = join(fromDir, importPath).replace(/\\/g, "/");
    return resolved;
  }

  // Handle ~ alias
  if (importPath.startsWith("~/")) {
    return importPath.substring(2);
  }

  return importPath;
}

if (import.meta.main) {
  main().catch(console.error);
}
