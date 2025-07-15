#!/usr/bin/env bun

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

interface UnusedImport {
  file: string;
  line: number;
  importName: string;
  moduleSpecifier: string;
  isTypeOnly: boolean;
}

function findTsFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules"
      ) {
        traverse(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function analyzeFile(filePath: string): UnusedImport[] {
  const sourceText = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  const unusedImports: UnusedImport[] = [];
  const importedNames = new Set<string>();
  const usedNames = new Set<string>();

  // First pass: collect all imported names
  function collectImports(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause;
      if (importClause) {
        // Default import
        if (importClause.name) {
          importedNames.add(importClause.name.text);
        }

        // Named imports
        if (importClause.namedBindings) {
          if (ts.isNamedImports(importClause.namedBindings)) {
            for (const element of importClause.namedBindings.elements) {
              importedNames.add(element.name.text);
            }
          } else if (ts.isNamespaceImport(importClause.namedBindings)) {
            importedNames.add(importClause.namedBindings.name.text);
          }
        }
      }
    }
    ts.forEachChild(node, collectImports);
  }

  // Second pass: collect all used identifiers
  function collectUsages(node: ts.Node) {
    if (ts.isIdentifier(node) && !ts.isImportDeclaration(node.parent)) {
      usedNames.add(node.text);
    }
    ts.forEachChild(node, collectUsages);
  }

  // Third pass: identify unused imports
  function findUnusedImports(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier =
        node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : "";
      const isTypeOnly = node.importClause?.isTypeOnly;

      const importClause = node.importClause;
      if (importClause) {
        // Check default import
        if (importClause.name && !usedNames.has(importClause.name.text)) {
          const lineNumber =
            sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          unusedImports.push({
            file: filePath,
            line: lineNumber,
            importName: importClause.name.text,
            moduleSpecifier,
            isTypeOnly,
          });
        }

        // Check named imports
        if (
          importClause.namedBindings &&
          ts.isNamedImports(importClause.namedBindings)
        ) {
          for (const element of importClause.namedBindings.elements) {
            if (!usedNames.has(element.name.text)) {
              const lineNumber =
                sourceFile.getLineAndCharacterOfPosition(node.getStart()).line +
                1;
              unusedImports.push({
                file: filePath,
                line: lineNumber,
                importName: element.name.text,
                moduleSpecifier,
                isTypeOnly: isTypeOnly || element.isTypeOnly,
              });
            }
          }
        }

        // Check namespace import
        if (
          importClause.namedBindings &&
          ts.isNamespaceImport(importClause.namedBindings)
        ) {
          if (!usedNames.has(importClause.namedBindings.name.text)) {
            const lineNumber =
              sourceFile.getLineAndCharacterOfPosition(node.getStart()).line +
              1;
            unusedImports.push({
              file: filePath,
              line: lineNumber,
              importName: importClause.namedBindings.name.text,
              moduleSpecifier,
              isTypeOnly,
            });
          }
        }
      }
    }
    ts.forEachChild(node, findUnusedImports);
  }

  collectImports(sourceFile);
  collectUsages(sourceFile);
  findUnusedImports(sourceFile);

  return unusedImports;
}

function main() {
  const srcDir = path.join(process.cwd(), "src");
  const tsFiles = findTsFiles(srcDir);

  console.log(`Analyzing ${tsFiles.length} TypeScript files...`);

  const allUnusedImports: UnusedImport[] = [];

  for (const file of tsFiles) {
    try {
      const unusedImports = analyzeFile(file);
      allUnusedImports.push(...unusedImports);
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }

  if (allUnusedImports.length === 0) {
    console.log("✅ No unused imports found!");
    return;
  }

  console.log(`\n🔍 Found ${allUnusedImports.length} unused imports:\n`);

  // Group by file
  const byFile = allUnusedImports.reduce(
    (acc, item) => {
      const relativePath = path.relative(process.cwd(), item.file);
      if (!acc[relativePath]) {
        acc[relativePath] = [];
      }
      acc[relativePath].push(item);
      return acc;
    },
    {} as Record<string, UnusedImport[]>,
  );

  for (const [file, imports] of Object.entries(byFile)) {
    console.log(`📁 ${file}:`);
    for (const imp of imports) {
      const typeIndicator = imp.isTypeOnly ? " (type)" : "";
      console.log(
        `  Line ${imp.line}: ${imp.importName}${typeIndicator} from "${imp.moduleSpecifier}"`,
      );
    }
    console.log();
  }

  // Output JSON for programmatic processing
  fs.writeFileSync(
    path.join(process.cwd(), "unused-imports.json"),
    JSON.stringify(allUnusedImports, null, 2),
  );

  console.log("📄 Detailed results saved to unused-imports.json");
}

if (import.meta.main) {
  main();
}
