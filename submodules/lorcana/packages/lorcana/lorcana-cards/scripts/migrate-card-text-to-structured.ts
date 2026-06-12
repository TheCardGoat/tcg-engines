#!/usr/bin/env bun

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import type { CardTextEntry, LorcanaCard } from "@tcg/lorcana-types";
import { allCards } from "../src/cards/catalog-data";
import {
  normalizeCardTextContent,
  normalizeCardTextEntries,
  shouldUsePlainStringCardText,
  splitCardTextToEntries,
} from "./utils/structured-card-text";

const PACKAGE_ROOT = join(import.meta.dir, "..");
const CARDS_ROOT = join(PACKAGE_ROOT, "src", "cards");

function* walkCardFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filePath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) continue;
      yield* walkCardFiles(filePath);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name === "index.ts" || entry.name === "cards.ts") continue;
    if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".spec.ts")) continue;

    yield filePath;
  }
}

function getPropertyNameText(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return null;
}

function getExportedCardObject(sourceFile: ts.SourceFile): ts.ObjectLiteralExpression | null {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;

    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
        return declaration.initializer;
      }
    }
  }

  return null;
}

function getTopLevelPropertyAssignments(
  objectLiteral: ts.ObjectLiteralExpression,
  propertyName: string,
): ts.PropertyAssignment[] {
  return objectLiteral.properties.filter(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && getPropertyNameText(property.name) === propertyName,
  );
}

function getStringLiteralValue(expression: ts.Expression): string | null {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  return null;
}

function areEntriesEqual(left: CardTextEntry[], right: CardTextEntry[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (entry, index) =>
        entry.title === right[index]?.title && entry.description === right[index]?.description,
    )
  );
}

function getArrayEntry(objectLiteral: ts.ObjectLiteralExpression): CardTextEntry | null {
  let title: string | undefined;
  let description: string | undefined;

  for (const nestedProperty of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(nestedProperty)) continue;

    const propertyName = getPropertyNameText(nestedProperty.name);
    const propertyValue = getStringLiteralValue(nestedProperty.initializer);

    if (propertyName === "title" && propertyValue != null) {
      title = normalizeCardTextContent(propertyValue);
    }

    if (propertyName === "description" && propertyValue != null) {
      description = normalizeCardTextContent(propertyValue);
    }
  }

  if (!title) return null;

  return {
    title,
    ...(description ? { description } : {}),
  };
}

function getNormalizedTextInitializer(expression: ts.Expression): string | CardTextEntry[] | null {
  const stringValue = getStringLiteralValue(expression);

  if (stringValue != null) {
    return normalizeCardTextContent(stringValue);
  }

  if (!ts.isArrayLiteralExpression(expression)) {
    return null;
  }

  const entries: CardTextEntry[] = [];

  for (const element of expression.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      return null;
    }

    const entry = getArrayEntry(element);

    if (!entry) {
      return null;
    }

    entries.push(entry);
  }

  return entries;
}

function formatStringLiteral(text: string): string {
  return `"${text
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, String.raw`\"`)
    .replace(/\n/g, String.raw`\n`)
    .replace(/\r/g, String.raw`\r`)
    .replace(/\t/g, String.raw`\t`)}"`;
}

function createTextInitializer(entries: CardTextEntry[]): string {
  if (shouldUsePlainStringCardText(entries)) {
    return formatStringLiteral(entries[0]!.title);
  }

  const entryStrings = entries.map((entry) => {
    const properties = [`title: ${formatStringLiteral(entry.title)}`];

    if (entry.description) {
      properties.push(`description: ${formatStringLiteral(entry.description)}`);
    }

    return `{\n${properties.map((property) => `  ${property},`).join("\n")}\n}`;
  });

  return `[\n${entryStrings.map((entry) => `  ${entry},`).join("\n")}\n]`;
}

function runFormatter(filePaths: string[]) {
  const batchSize = 100;

  for (let index = 0; index < filePaths.length; index += batchSize) {
    const batch = filePaths.slice(index, index + batchSize);
    const result = Bun.spawnSync({
      cmd: [
        "bun",
        "x",
        "oxfmt",
        "--write",
        ...batch.map((filePath) => relative(PACKAGE_ROOT, filePath)),
      ],
      cwd: PACKAGE_ROOT,
      stdout: "pipe",
      stderr: "pipe",
    });

    if (result.exitCode !== 0) {
      throw new Error(
        ["oxfmt failed", result.stdout.toString().trim(), result.stderr.toString().trim()]
          .filter(Boolean)
          .join("\n"),
      );
    }
  }
}

function main() {
  const textByCardId = new Map<string, CardTextEntry[]>();

  for (const card of allCards as LorcanaCard[]) {
    if (!card.text) continue;

    if (typeof card.text === "string") {
      const normalizedText = normalizeCardTextContent(card.text).trim();
      if (!normalizedText) continue;

      textByCardId.set(card.id, normalizeCardTextEntries(splitCardTextToEntries(normalizedText)));
      continue;
    }

    if (card.text.length > 0) {
      textByCardId.set(card.id, normalizeCardTextEntries(card.text));
    }
  }

  const touchedFiles: string[] = [];
  let skippedArrayText = 0;
  let skippedWithoutStringText = 0;

  for (const filePath of walkCardFiles(CARDS_ROOT)) {
    const sourceText = readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const cardObject = getExportedCardObject(sourceFile);

    if (!cardObject) {
      skippedWithoutStringText++;
      continue;
    }

    const idProperty = getTopLevelPropertyAssignments(cardObject, "id")[0];
    if (!idProperty) {
      skippedWithoutStringText++;
      continue;
    }

    const cardId = getStringLiteralValue(idProperty.initializer);
    if (!cardId) {
      skippedWithoutStringText++;
      continue;
    }

    const textProperties = getTopLevelPropertyAssignments(cardObject, "text");

    const supportedTextProperty = textProperties.find(
      (property) =>
        ts.isArrayLiteralExpression(property.initializer) ||
        ts.isStringLiteral(property.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(property.initializer),
    );

    const desiredEntries = textByCardId.get(cardId);

    if (!supportedTextProperty || !desiredEntries) {
      skippedWithoutStringText++;
      continue;
    }

    const currentTextValue = getNormalizedTextInitializer(supportedTextProperty.initializer);

    if (shouldUsePlainStringCardText(desiredEntries)) {
      const desiredString = desiredEntries[0]!.title;
      if (typeof currentTextValue === "string" && currentTextValue === desiredString) {
        skippedWithoutStringText++;
        continue;
      }
    } else if (
      Array.isArray(currentTextValue) &&
      areEntriesEqual(currentTextValue, desiredEntries)
    ) {
      skippedArrayText++;
      continue;
    }

    const nextInitializer = createTextInitializer(desiredEntries);
    const start = supportedTextProperty.initializer.getStart(sourceFile);
    const end = supportedTextProperty.initializer.getEnd();
    const nextSourceText = `${sourceText.slice(0, start)}${nextInitializer}${sourceText.slice(end)}`;

    if (nextSourceText === sourceText) {
      if (ts.isArrayLiteralExpression(supportedTextProperty.initializer)) {
        skippedArrayText++;
      } else {
        skippedWithoutStringText++;
      }
      continue;
    }

    writeFileSync(filePath, nextSourceText);
    touchedFiles.push(filePath);
  }

  if (touchedFiles.length > 0) {
    runFormatter(touchedFiles);
  }

  console.log(`Cards discovered: ${allCards.length}`);
  console.log(`Files rewritten: ${touchedFiles.length}`);
  console.log(`Files skipped (already array text): ${skippedArrayText}`);
  console.log(`Files skipped (no top-level string text): ${skippedWithoutStringText}`);

  if (touchedFiles.length > 0) {
    console.log("Rewritten files:");
    for (const filePath of touchedFiles) {
      console.log(relative(PACKAGE_ROOT, filePath));
    }
  }
}

main();
