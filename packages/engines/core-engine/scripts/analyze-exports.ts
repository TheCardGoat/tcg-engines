#!/usr/bin/env bun

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

interface ExportInfo {
  file: string;
  name: string;
  type: "named" | "default" | "namespace" | "re-export";
  isTypeOnly: boolean;
  source?: string; // For re-exports
  line: number;
}

interface ImportInfo {
  file: string;
  name: string;
  source: string;
  isTypeOnly: boolean;
  line: number;
}

class SimpleExportAnalyzer {
  private exports: ExportInfo[] = [];
  private imports: ImportInfo[] = [];
  private sourceRoot: string;

  constructor(sourceRoot: string) {
    this.sourceRoot = sourceRoot;
  }

  async analyze() {
    await this.scanFiles(this.sourceRoot);

    return {
      exports: this.exports,
      imports: this.imports,
      unusedExports: this.findUnusedExports(),
      reExportChains: this.findReExportChains(),
    };
  }

  private async scanFiles(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules"
      ) {
        await this.scanFiles(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        await this.analyzeFile(fullPath);
      }
    }
  }

  private async analyzeFile(filePath: string) {
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");
    const relativePath = filePath.replace(this.sourceRoot + "/", "");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Analyze exports
      this.analyzeExportLine(line, relativePath, lineNumber);

      // Analyze imports
      this.analyzeImportLine(line, relativePath, lineNumber);
    }
  }

  private analyzeExportLine(line: string, file: string, lineNumber: number) {
    // export * from "module"
    const namespaceReExportMatch = line.match(
      /^export\s+\*\s+from\s+["']([^"']+)["']/,
    );
    if (namespaceReExportMatch) {
      this.exports.push({
        file,
        name: "*",
        type: "re-export",
        isTypeOnly: false,
        source: namespaceReExportMatch[1],
        line: lineNumber,
      });
      return;
    }

    // export type * from "module"
    const typeNamespaceReExportMatch = line.match(
      /^export\s+type\s+\*\s+from\s+["']([^"']+)["']/,
    );
    if (typeNamespaceReExportMatch) {
      this.exports.push({
        file,
        name: "*",
        type: "re-export",
        isTypeOnly: true,
        source: typeNamespaceReExportMatch[1],
        line: lineNumber,
      });
      return;
    }

    // export { name1, name2 } from "module"
    const namedReExportMatch = line.match(
      /^export\s+(?:type\s+)?{([^}]+)}\s+from\s+["']([^"']+)["']/,
    );
    if (namedReExportMatch) {
      const isTypeOnly = line.includes("export type");
      const names = namedReExportMatch[1]
        .split(",")
        .map((n) => n.trim().replace(/\s+as\s+\w+/, ""));
      const source = namedReExportMatch[2];

      for (const name of names) {
        if (name) {
          this.exports.push({
            file,
            name: name.trim(),
            type: "re-export",
            isTypeOnly,
            source,
            line: lineNumber,
          });
        }
      }
      return;
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
          this.exports.push({
            file,
            name: name.trim(),
            type: "named",
            isTypeOnly,
            line: lineNumber,
          });
        }
      }
      return;
    }

    // export const/let/var/function/class/interface/type
    const declarationExportMatch = line.match(
      /^export\s+(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/,
    );
    if (declarationExportMatch) {
      const isTypeOnly =
        line.includes("interface") ||
        line.includes("type ") ||
        line.includes("enum");
      this.exports.push({
        file,
        name: declarationExportMatch[1],
        type: "named",
        isTypeOnly,
        line: lineNumber,
      });
      return;
    }

    // export default
    if (line.match(/^export\s+default/)) {
      this.exports.push({
        file,
        name: "default",
        type: "default",
        isTypeOnly: false,
        line: lineNumber,
      });
    }
  }

  private analyzeImportLine(line: string, file: string, lineNumber: number) {
    // import * as name from "module"
    const namespaceImportMatch = line.match(
      /^import\s+(?:type\s+)?\*\s+as\s+\w+\s+from\s+["']([^"']+)["']/,
    );
    if (namespaceImportMatch) {
      const isTypeOnly = line.includes("import type");
      this.imports.push({
        file,
        name: "*",
        source: namespaceImportMatch[1],
        isTypeOnly,
        line: lineNumber,
      });
      return;
    }

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
          this.imports.push({
            file,
            name: name.trim(),
            source,
            isTypeOnly,
            line: lineNumber,
          });
        }
      }
      return;
    }

    // import defaultName from "module"
    const defaultImportMatch = line.match(
      /^import\s+(?:type\s+)?(\w+)\s+from\s+["']([^"']+)["']/,
    );
    if (defaultImportMatch) {
      const isTypeOnly = line.includes("import type");
      this.imports.push({
        file,
        name: "default",
        source: defaultImportMatch[2],
        isTypeOnly,
        line: lineNumber,
      });
    }
  }

  private findUnusedExports(): ExportInfo[] {
    const unused: ExportInfo[] = [];

    for (const exportInfo of this.exports) {
      // Skip re-exports for now - they're more complex to analyze
      if (exportInfo.type === "re-export") continue;

      // Check if this export is imported anywhere
      const isUsed = this.imports.some((importInfo) => {
        const resolvedSource = this.resolveImportPath(
          importInfo.source,
          importInfo.file,
        );
        const exportFilePath = exportInfo.file;

        return (
          (resolvedSource === exportFilePath ||
            resolvedSource === exportFilePath.replace(/\.ts$/, "") ||
            resolvedSource + ".ts" === exportFilePath) &&
          (importInfo.name === exportInfo.name || importInfo.name === "*")
        );
      });

      if (!isUsed) {
        unused.push(exportInfo);
      }
    }

    return unused;
  }

  private findReExportChains(): Array<{ file: string; chain: ExportInfo[] }> {
    const chains: Array<{ file: string; chain: ExportInfo[] }> = [];

    // Group re-exports by file
    const reExportsByFile = new Map<string, ExportInfo[]>();

    for (const exportInfo of this.exports) {
      if (exportInfo.type === "re-export") {
        if (!reExportsByFile.has(exportInfo.file)) {
          reExportsByFile.set(exportInfo.file, []);
        }
        reExportsByFile.get(exportInfo.file)!.push(exportInfo);
      }
    }

    // Find files with multiple re-exports (potential chains)
    for (const [file, reExports] of reExportsByFile) {
      if (reExports.length > 2) {
        chains.push({ file, chain: reExports });
      }
    }

    return chains;
  }

  private resolveImportPath(importPath: string, fromFile: string): string {
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
}

async function main() {
  const analyzer = new SimpleExportAnalyzer("src");
  const results = await analyzer.analyze();

  console.log("=== EXPORT ANALYSIS RESULTS ===\n");

  console.log(`Total exports found: ${results.exports.length}`);
  console.log(`Total imports found: ${results.imports.length}`);
  console.log(`Unused exports: ${results.unusedExports.length}`);
  console.log(
    `Files with re-export chains: ${results.reExportChains.length}\n`,
  );

  if (results.unusedExports.length > 0) {
    console.log("=== UNUSED EXPORTS ===");
    for (const unused of results.unusedExports) {
      console.log(
        `${unused.file}:${unused.line} - ${unused.name} (${unused.type}${unused.isTypeOnly ? ", type-only" : ""})`,
      );
    }
    console.log();
  }

  if (results.reExportChains.length > 0) {
    console.log("=== RE-EXPORT CHAINS ===");
    for (const chain of results.reExportChains) {
      console.log(`${chain.file}:`);
      for (const reExport of chain.chain) {
        console.log(
          `  - ${reExport.name} from ${reExport.source} (line ${reExport.line})`,
        );
      }
      console.log();
    }
  }

  // Save detailed results to file
  await Bun.write(
    "packages/engines/core-engine/export-analysis.json",
    JSON.stringify(results, null, 2),
  );

  console.log("Detailed results saved to export-analysis.json");
}

if (import.meta.main) {
  main().catch(console.error);
}
