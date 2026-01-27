#!/usr/bin/env bun

/**
 * Verify Card Files
 *
 * Checks all generated card files for common issues:
 * - HTML entities in text fields (&lt;, &gt;, etc.)
 * - Unescaped line breaks in strings
 * - HTML tags (<br>, <br/>, etc.)
 * - TypeScript syntax errors
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";

interface Issue {
  file: string;
  line: number;
  type: string;
  message: string;
  snippet?: string;
}

const SETS_DIR = "src/cards/sets";
const ISSUES: Issue[] = [];

async function* walkDirectory(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkDirectory(fullPath);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "index.ts"
    ) {
      yield fullPath;
    }
  }
}

function checkHtmlEntities(content: string, filepath: string) {
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for HTML entities
    const htmlEntities = [
      "&lt;",
      "&gt;",
      "&amp;",
      "&quot;",
      "&#039;",
      "&nbsp;",
    ];
    for (const entity of htmlEntities) {
      if (line.includes(entity)) {
        ISSUES.push({
          file: filepath,
          line: i + 1,
          type: "html_entity",
          message: `Found HTML entity: ${entity}`,
          snippet: line.trim(),
        });
      }
    }

    // Check for HTML tags (but not in URLs)
    if (!(line.includes("imageUrl") || line.includes("http"))) {
      const htmlTags = /<br\s*\/?>/gi;
      if (htmlTags.test(line)) {
        ISSUES.push({
          file: filepath,
          line: i + 1,
          type: "html_tag",
          message: "Found unescaped HTML tag",
          snippet: line.trim(),
        });
      }
    }
  }
}

function checkLiteralLineBreaks(content: string, filepath: string) {
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line is part of a string literal
    // Look for lines that start with whitespace and end with a continuation
    // or lines in the middle of a multi-line string
    if (line.match(/^\s+[^:]+[^"\\]$/)) {
      // Check if this looks like it's continuing a string from previous line
      if (i > 0) {
        const prevLine = lines[i - 1];
        // If previous line has an unclosed string and current line doesn't start with a quote
        if (prevLine.includes("text:") && prevLine.match(/"\s*[^"]*$/)) {
          // Check if line doesn't end with escaped newline or quote
          if (!(line.trim().endsWith('",') || line.includes("\\n"))) {
            ISSUES.push({
              file: filepath,
              line: i + 1,
              type: "literal_linebreak",
              message: "Possible literal line break in string",
              snippet: line.trim(),
            });
          }
        }
      }
    }
  }
}

function checkTypeScriptSyntax(content: string, filepath: string) {
  // Basic syntax checks
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for unclosed strings
    const quotes = line.match(/"/g);
    if (quotes && quotes.length % 2 !== 0 && !line.includes('\\"')) {
      // Could be a multi-line string issue
      ISSUES.push({
        file: filepath,
        line: i + 1,
        type: "syntax_error",
        message: "Possible unclosed string",
        snippet: line.trim(),
      });
    }
  }
}

async function verifyFile(filepath: string) {
  try {
    const content = await readFile(filepath, "utf-8");

    checkHtmlEntities(content, filepath);
    checkLiteralLineBreaks(content, filepath);
    checkTypeScriptSyntax(content, filepath);
  } catch (error) {
    ISSUES.push({
      file: filepath,
      line: 0,
      type: "read_error",
      message: `Failed to read file: ${error}`,
    });
  }
}

async function main() {
  console.log("🔍 Verifying card files...\n");

  let fileCount = 0;
  const startTime = Date.now();

  for await (const filepath of walkDirectory(SETS_DIR)) {
    await verifyFile(filepath);
    fileCount++;

    if (fileCount % 50 === 0) {
      console.log(`   Checked ${fileCount} files...`);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Checked ${fileCount} files in ${duration}s\n`);

  if (ISSUES.length === 0) {
    console.log("🎉 No issues found! All files are valid.\n");
    return;
  }

  // Group issues by type
  const issuesByType = new Map<string, Issue[]>();
  for (const issue of ISSUES) {
    const existing = issuesByType.get(issue.type) || [];
    existing.push(issue);
    issuesByType.set(issue.type, existing);
  }

  console.log(
    `⚠️  Found ${ISSUES.length} issue(s) in ${new Set(ISSUES.map((i) => i.file)).size} file(s)\n`,
  );

  // Print summary by type
  console.log("📊 Issues by type:");
  for (const [type, issues] of issuesByType) {
    console.log(`   ${type}: ${issues.length}`);
  }
  console.log();

  // Print detailed issues
  console.log("📋 Detailed issues:\n");

  for (const [type, issues] of issuesByType) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${type.toUpperCase().replace(/_/g, " ")}`);
    console.log(`${"=".repeat(60)}\n`);

    // Group by file
    const issuesByFile = new Map<string, Issue[]>();
    for (const issue of issues) {
      const existing = issuesByFile.get(issue.file) || [];
      existing.push(issue);
      issuesByFile.set(issue.file, existing);
    }

    for (const [file, fileIssues] of issuesByFile) {
      console.log(`📁 ${file}`);
      for (const issue of fileIssues) {
        console.log(`   Line ${issue.line}: ${issue.message}`);
        if (issue.snippet) {
          console.log(`   > ${issue.snippet}`);
        }
      }
      console.log();
    }
  }

  process.exit(1);
}

if (import.meta.main) {
  main().catch(console.error);
}
