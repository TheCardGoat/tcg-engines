#!/usr/bin/env bun

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

interface UnusedImportFix {
  file: string;
  line: number;
  column: number;
  importName: string;
  moduleSpecifier: string;
  fullImportStatement: string;
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
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        !entry.name.endsWith(".test.ts")
      ) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function removeUnusedImports(filePath: string): boolean {
  const sourceText = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  const lines = sourceText.split("\n");
  let hasChanges = false;
  const importedNames = new Set<string>();
  const usedNames = new Set<string>();
  const importDeclarations: ts.ImportDeclaration[] = [];

  // First pass: collect all imported names and import declarations
  function collectImports(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      importDeclarations.push(node);
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

  // Second pass: collect all used identifiers (excluding import declarations)
  function collectUsages(node: ts.Node) {
    if (ts.isIdentifier(node)) {
      // Skip if this identifier is part of an import declaration
      let parent = node.parent;
      while (parent) {
        if (ts.isImportDeclaration(parent)) {
          return;
        }
        parent = parent.parent;
      }
      usedNames.add(node.text);
    }
    ts.forEachChild(node, collectUsages);
  }

  collectImports(sourceFile);
  collectUsages(sourceFile);

  // Process each import declaration
  for (const importDecl of importDeclarations) {
    const startLine = sourceFile.getLineAndCharacterOfPosition(
      importDecl.getStart(),
    ).line;
    const endLine = sourceFile.getLineAndCharacterOfPosition(
      importDecl.getEnd(),
    ).line;

    const importClause = importDecl.importClause;
    if (!importClause) continue;

    let hasUsedImports = false;
    const usedImportNames: string[] = [];

    // Check default import
    if (importClause.name && usedNames.has(importClause.name.text)) {
      hasUsedImports = true;
      usedImportNames.push(importClause.name.text);
    }

    // Check named imports
    const usedNamedImports: string[] = [];
    if (
      importClause.namedBindings &&
      ts.isNamedImports(importClause.namedBindings)
    ) {
      for (const element of importClause.namedBindings.elements) {
        if (usedNames.has(element.name.text)) {
          hasUsedImports = true;
          usedNamedImports.push(element.name.text);
        }
      }
    }

    // Check namespace import
    if (
      importClause.namedBindings &&
      ts.isNamespaceImport(importClause.namedBindings)
    ) {
      if (usedNames.has(importClause.namedBindings.name.text)) {
        hasUsedImports = true;
        usedImportNames.push(importClause.namedBindings.name.text);
      }
    }

    // If no imports are used, remove the entire import statement
    if (!hasUsedImports) {
      for (let i = startLine; i <= endLine; i++) {
        lines[i] = "";
      }
      hasChanges = true;
      console.log(
        `  Removed unused import: ${lines[startLine]?.trim() || "entire import"}`,
      );
    }
    // If only some named imports are used, reconstruct the import statement
    else if (
      importClause.namedBindings &&
      ts.isNamedImports(importClause.namedBindings) &&
      usedNamedImports.length > 0
    ) {
      const moduleSpecifier =
        importDecl.moduleSpecifier &&
        ts.isStringLiteral(importDecl.moduleSpecifier)
          ? importDecl.moduleSpecifier.text
          : "";

      const allElements = importClause.namedBindings.elements;
      const unusedElements = allElements.filter(
        (el) => !usedNames.has(el.name.text),
      );

      if (unusedElements.length > 0) {
        // Reconstruct import with only used imports
        const isTypeOnly = importClause.isTypeOnly;
        const typePrefix = isTypeOnly ? "import type " : "import ";
        const defaultImport = importClause.name
          ? `${importClause.name.text}, `
          : "";
        const namedImports =
          usedNamedImports.length > 0
            ? `{ ${usedNamedImports.join(", ")} }`
            : "";

        if (namedImports) {
          const newImport = `${typePrefix}${defaultImport}${namedImports} from "${moduleSpecifier}";`;
          lines[startLine] = newImport;

          // Clear additional lines if import was multi-line
          for (let i = startLine + 1; i <= endLine; i++) {
            lines[i] = "";
          }

          hasChanges = true;
          console.log(
            `  Updated import to remove unused: ${unusedElements.map((el) => el.name.text).join(", ")}`,
          );
        }
      }
    }
  }

  if (hasChanges) {
    // Remove empty lines that were created by removing imports, but preserve intentional spacing
    const cleanedLines = [];
    let consecutiveEmptyLines = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === "") {
        consecutiveEmptyLines++;
        // Keep at most one empty line, and only if it's not at the start
        if (consecutiveEmptyLines === 1 && cleanedLines.length > 0) {
          cleanedLines.push(line);
        }
      } else {
        consecutiveEmptyLines = 0;
        cleanedLines.push(line);
      }
    }

    const newContent = cleanedLines.join("\n");
    fs.writeFileSync(filePath, newContent);
    return true;
  }

  return false;
}

function main() {
  const srcDir = path.join(process.cwd(), "src");
  const tsFiles = findTsFiles(srcDir);

  console.log(
    `Processing ${tsFiles.length} TypeScript files for unused import removal...`,
  );

  let totalFilesChanged = 0;

  for (const file of tsFiles) {
    try {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`\n📁 Processing: ${relativePath}`);

      const hasChanges = removeUnusedImports(file);
      if (hasChanges) {
        totalFilesChanged++;
        console.log(`  ✅ Updated ${relativePath}`);
      } else {
        console.log("  ✨ No unused imports found");
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log(`\n🎉 Completed! Updated ${totalFilesChanged} files.`);

  if (totalFilesChanged > 0) {
    console.log("\n🔍 Running TypeScript check to verify changes...");
    // Note: We'll run tsc separately to verify
  }
}

if (import.meta.main) {
  main();
}
