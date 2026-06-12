#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import type { I18nProperties, Languages } from "@tcg/lorcana-types";

const CARDS_DIR = path.resolve(import.meta.dir, "../src/cards");

interface ExtractedI18n {
  i18n: Record<Languages, I18nProperties>;
  exportName: string;
}

function extractI18nFromFile(filePath: string): ExtractedI18n | null {
  const content = fs.readFileSync(filePath, "utf-8");

  const exportMatch = content.match(/export\s+const\s+(\w+):\s*\w+\s*=\s*\{/);
  if (!exportMatch) {
    console.log(`  ⚠️  Could not find export in ${filePath}`);
    return null;
  }
  const exportName = exportMatch[1];

  const i18nStart = content.indexOf("i18n: {");
  if (i18nStart === -1) {
    return null;
  }

  let depth = 0;
  let i18nEnd = i18nStart;
  const startIndex = content.indexOf("{", i18nStart);

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === "{") {
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0) {
        i18nEnd = i;
        break;
      }
    }
  }

  const i18nContent = content.slice(startIndex, i18nEnd + 1);

  try {
    const i18n = new Function(`return ${i18nContent}`)() as Record<Languages, I18nProperties>;
    return { i18n, exportName };
  } catch (e) {
    console.log(`  ⚠️  Could not parse i18n from ${filePath}: ${e}`);
    return null;
  }
}

function generateI18nFileContent(
  exportName: string,
  i18n: Record<Languages, I18nProperties>,
): string {
  const i18nJson = JSON.stringify(i18n, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, '"');

  return `import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ${exportName}I18n: Record<Languages, I18nProperties> = ${i18nJson};
`;
}

function generateUpdatedCardFile(
  originalContent: string,
  exportName: string,
  i18nFileName: string,
): string {
  let content = originalContent;

  const importLine = `import { ${exportName}I18n } from "./${i18nFileName}";`;

  const lastImportEnd = content.lastIndexOf(";");
  if (lastImportEnd === -1) {
    return originalContent;
  }

  const nextNewline = content.indexOf("\n", lastImportEnd);
  if (nextNewline === -1) {
    return originalContent;
  }

  content = content.slice(0, nextNewline + 1) + importLine + "\n" + content.slice(nextNewline + 1);

  const i18nStart = content.indexOf("i18n: {");
  if (i18nStart === -1) {
    return originalContent;
  }

  let depth = 0;
  let i18nEnd = i18nStart;
  const startIndex = content.indexOf("{", i18nStart);

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === "{") {
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0) {
        i18nEnd = i;
        break;
      }
    }
  }

  const beforeI18n = content.slice(0, i18nStart);
  const afterI18n = content.slice(i18nEnd + 1);

  return `${beforeI18n}i18n: ${exportName}I18n,${afterI18n}`;
}

function findCardFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findCardFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".i18n.ts") &&
      !entry.name.endsWith("index.ts")
    ) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (
        content.includes("i18n:") &&
        content.includes("Card") &&
        content.includes("export const")
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function main(): void {
  console.log("📦 Extracting i18n from card files...");

  const cardFiles = findCardFiles(CARDS_DIR);
  console.log(`  Found ${cardFiles.length} card files with i18n`);

  let extracted = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of cardFiles) {
    const relativePath = path.relative(CARDS_DIR, filePath);
    const i18nPath = filePath.replace(".ts", ".i18n.ts");

    if (fs.existsSync(i18nPath)) {
      skipped++;
      continue;
    }

    const result = extractI18nFromFile(filePath);
    if (!result) {
      errors++;
      continue;
    }

    const i18nContent = generateI18nFileContent(result.exportName, result.i18n);
    fs.writeFileSync(i18nPath, i18nContent, "utf-8");

    const i18nFileName = path.basename(i18nPath, ".ts");
    const originalContent = fs.readFileSync(filePath, "utf-8");
    const updatedContent = generateUpdatedCardFile(
      originalContent,
      result.exportName,
      i18nFileName,
    );
    fs.writeFileSync(filePath, updatedContent, "utf-8");

    console.log(`  ✅ ${relativePath}`);
    extracted++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Extracted: ${extracted}`);
  console.log(`  Skipped (already exists): ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

if (import.meta.main) {
  main();
}
