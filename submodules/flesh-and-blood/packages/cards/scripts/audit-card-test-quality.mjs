#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");

function cardTestFiles(root) {
  const cardsRoot = path.join(root, "src", "cards");
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.name.endsWith(".test.ts")) files.push(absolute);
    }
  };
  if (existsSync(cardsRoot)) visit(cardsRoot);
  return files.sort((a, b) => String(a).localeCompare(String(b)));
}

function callName(node) {
  if (ts.isIdentifier(node.expression)) return node.expression.text;
  if (ts.isPropertyAccessExpression(node.expression)) return node.expression.name.text;
  return null;
}

export function auditCardTestSource(source, fileName = "card.test.ts") {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const issues = [];
  const report = (node, code, message) => {
    const position = file.getLineAndCharacterOfPosition(node.getStart(file));
    issues.push({ code, message, line: position.line + 1, column: position.character + 1 });
  };
  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const name = callName(node);
      if (name === "defineFleshAndBloodCard" || name === "trainerId") {
        report(node, "synthetic-card", "card suites must use real authored card modules");
      }
      if (
        name === "stringify" &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.expression.getText(file) === "JSON"
      ) {
        report(node, "serialized-ir", "serialized authored IR is not gameplay coverage");
      }
      if (name === "expect" && node.arguments[0]?.getText(file).includes(".abilities")) {
        report(
          node,
          "ability-shape-assertion",
          "play the card instead of asserting its ability IR",
        );
      }
      if ((name === "it" || name === "test") && ts.isStringLiteralLike(node.arguments[0])) {
        const title = node.arguments[0].text.toLowerCase();
        if (title.includes("fragment pin") || title.includes("model-level pin")) {
          report(node.arguments[0], "pin-test", "a model pin does not prove printed behavior");
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return issues;
}

export function auditCardTests({ packageRoot = DEFAULT_ROOT } = {}) {
  return cardTestFiles(packageRoot).flatMap((absolute) =>
    auditCardTestSource(readFileSync(absolute, "utf8"), absolute).map((issue) => ({
      ...issue,
      file: path.relative(packageRoot, absolute).replaceAll(path.sep, "/"),
    })),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  const issues = auditCardTests();
  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.file}:${issue.line}:${issue.column} ${issue.code}: ${issue.message}`);
    }
    process.exitCode = 1;
  } else {
    console.log("Card test quality audit passed.");
  }
}
