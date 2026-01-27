#!/usr/bin/env bun
/**
 * Script to clean HTML entities and tags from card text fields
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cleanCardText } from "../parser/text-parser";

const CARDS_DIR = join(import.meta.dir, "../../src/cards/sets");

async function getCardFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await getCardFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function cleanCardFile(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, "utf-8");

  // Check if the text field contains HTML entities or tags
  if (
    !(
      content.includes("&lt;") ||
      content.includes("&gt;") ||
      content.includes("&amp;") ||
      content.includes("&quot;") ||
      content.includes("&#039;") ||
      content.includes("<br")
    )
  ) {
    return false; // Already clean
  }

  // Match the text field value
  const textFieldRegex = /text:\s*"([^"]*(?:\\.[^"]*)*)"/;
  const match = content.match(textFieldRegex);

  if (!match) {
    console.log(`⚠️  Could not find text field in ${filePath}`);
    return false;
  }

  const originalText = match[1];

  // Unescape the string literal (handle \" etc)
  const unescapedText = originalText
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

  // Clean the text
  const cleanedText = cleanCardText(unescapedText);

  // Escape for TypeScript string literal
  const escapedText = cleanedText
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");

  // Replace in the file
  const newContent = content.replace(textFieldRegex, `text: "${escapedText}"`);

  await writeFile(filePath, newContent, "utf-8");
  return true;
}

async function main() {
  console.log("🔍 Finding card files...");
  const files = await getCardFiles(CARDS_DIR);
  console.log(`📝 Found ${files.length} card files`);

  let cleanedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const wasCleaned = await cleanCardFile(file);
      if (wasCleaned) {
        cleanedCount++;
        const relativePath = file.replace(CARDS_DIR, "");
        console.log(`✅ Cleaned: ${relativePath}`);
      }
    } catch (error) {
      errorCount++;
      const relativePath = file.replace(CARDS_DIR, "");
      console.error(`❌ Error cleaning ${relativePath}:`, error);
    }
  }

  console.log("\n✨ Done!");
  console.log(`   Cleaned: ${cleanedCount} files`);
  console.log(
    `   Already clean: ${files.length - cleanedCount - errorCount} files`,
  );
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} files`);
  }
}

main();
