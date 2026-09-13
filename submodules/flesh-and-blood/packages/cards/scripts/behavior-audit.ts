/**
 * Exhaustive card-behavior inventory.
 *
 * This intentionally reads card source as data. Card text remains catalog
 * metadata; this audit only answers which structured ability-bearing modules
 * need a production behavior test.
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import ts from "typescript";

export type BehaviorKind = "ability" | "effect" | "trigger" | "keyword";

export interface CardBehaviorOccurrence {
  readonly cardPath: string;
  readonly canonicalId?: string;
  readonly set?: string;
  readonly collectorNumber?: string;
  readonly slug?: string;
  readonly kind: BehaviorKind;
  readonly behaviorKey: string;
  readonly sourceId: string;
}

export interface CardBehaviorInventory {
  readonly generatedAt: "source-derived";
  readonly cardModules: number;
  /** Complete engine-model union, including trigger kinds not yet stamped on a card. */
  readonly canonicalTriggerNames: readonly string[];
  readonly behaviorOccurrences: readonly CardBehaviorOccurrence[];
  readonly behaviorKeys: readonly string[];
}

export type BehaviorStatus = "planned" | "proven" | "blocked" | "out_of_scope";

export interface BehaviorStatusFile {
  readonly version: 1;
  readonly defaultStatus: BehaviorStatus;
  readonly overrides: Readonly<Record<string, BehaviorStatus>>;
}

export interface BehaviorLayoutReport {
  readonly errors: readonly string[];
  readonly counts: Readonly<Record<BehaviorStatus, number>>;
}

const EXCLUDED_NAMES = new Set(["index.ts", "metadata.ts", "legalities.ts"]);

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".i18n.ts") &&
      !EXCLUDED_NAMES.has(entry.name)
    )
      files.push(path);
  }
  return files.sort();
}

function propertyName(property: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(property) || ts.isStringLiteral(property) || ts.isNumericLiteral(property))
    return property.text;
  return undefined;
}

function literalValue(node: ts.Node): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node)) return { ref: node.text };
  if (ts.isPropertyAccessExpression(node)) return { ref: node.getText() };
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  )
    return literalValue(node.expression);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalValue);
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property.name);
        if (name) result[name] = literalValue(property.initializer);
      } else if (ts.isShorthandPropertyAssignment(property))
        result[property.name.text] = { ref: property.name.text };
    }
    return result;
  }
  return { source: node.getText() };
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function withoutIdentity(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutIdentity);
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (key !== "id" && key !== "canonicalId" && key !== "collectorNumber")
        result[key] = withoutIdentity(child);
    }
    return result;
  }
  return value;
}

function unwrapCardInitializer(node: ts.Expression): ts.Expression {
  let current: ts.Expression = node;
  for (let depth = 0; depth < 4; depth += 1) {
    if (
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current)
    ) {
      current = current.expression;
      continue;
    }
    // defineFleshAndBloodCard({ ... }) — audit the object literal argument.
    if (ts.isCallExpression(current) && current.arguments.length > 0) {
      const arg = current.arguments[0]!;
      if (ts.isExpression(arg)) {
        current = arg;
        continue;
      }
    }
    break;
  }
  return current;
}

function cardObjects(source: ts.SourceFile): readonly Record<string, unknown>[] {
  const cards: Record<string, unknown>[] = [];
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      const value = literalValue(unwrapCardInitializer(declaration.initializer));
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const object = value as Record<string, unknown>;
      if (typeof object.canonicalId === "string" && typeof object.slug === "string") {
        cards.push(object);
      }
    }
  }
  return cards;
}

function pitchFamilyObject(source: ts.SourceFile): Record<string, unknown> | undefined {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isCallExpression(declaration.initializer)) continue;
      const call = declaration.initializer;
      if (!ts.isIdentifier(call.expression) || call.expression.text !== "definePitchFamily")
        continue;
      const options = call.arguments[1];
      if (!options || !ts.isObjectLiteralExpression(options)) continue;
      const abilitiesProperty = options.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) && propertyName(property.name) === "abilities",
      );
      const abilitiesInitializer = abilitiesProperty?.initializer;
      if (
        !abilitiesInitializer ||
        (!ts.isArrowFunction(abilitiesInitializer) &&
          !ts.isFunctionExpression(abilitiesInitializer))
      ) {
        return { abilities: [] };
      }
      let body: ts.ConciseBody = abilitiesInitializer.body;
      while (ts.isParenthesizedExpression(body)) body = body.expression;
      if (!ts.isObjectLiteralExpression(body)) return { abilities: [] };
      const abilities = body.properties.flatMap((property) => {
        if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
          return [];
        }
        const initializer = ts.isPropertyAssignment(property)
          ? property.initializer
          : property.name;
        return [
          {
            kind: "family-helper",
            effect: { type: initializer.getText(source) },
          },
        ];
      });
      const keywordsProperty = options.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) && propertyName(property.name) === "keywords",
      );
      return {
        abilities,
        ...(keywordsProperty ? { keywords: literalValue(keywordsProperty.initializer) } : {}),
      };
    }
  }
  return undefined;
}

function collectEffects(value: unknown, output: Set<string>): void {
  if (Array.isArray(value)) value.forEach((item) => collectEffects(item, output));
  else if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (typeof object.type === "string") output.add(object.type);
    Object.values(object).forEach((child) => collectEffects(child, output));
  }
}

function collectTriggers(value: unknown, output: Set<string>): void {
  if (Array.isArray(value)) value.forEach((item) => collectTriggers(item, output));
  else if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    const trigger = object.trigger;
    if (trigger && typeof trigger === "object") {
      const event = (trigger as Record<string, unknown>).event;
      if (
        event &&
        typeof event === "object" &&
        typeof (event as Record<string, unknown>).name === "string"
      )
        output.add(String((event as Record<string, unknown>).name));
    }
    Object.values(object).forEach((child) => collectTriggers(child, output));
  }
}

function collectKeywords(value: unknown, output: Set<string>): void {
  if (Array.isArray(value)) value.forEach((item) => collectKeywords(item, output));
  else if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (typeof object.ref === "string") output.add(object.ref);
    Object.values(object).forEach((child) => collectKeywords(child, output));
  }
}

function constStringArrayMembers(source: ts.SourceFile, constName: string): string[] {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const declaration = statement.declarationList.declarations.find(
      (candidate) => ts.isIdentifier(candidate.name) && candidate.name.text === constName,
    );
    if (!declaration) continue;
    let initializer = declaration.initializer;
    if (!initializer) throw new Error(`${constName} has no initializer.`);
    if (ts.isAsExpression(initializer)) initializer = initializer.expression;
    if (!ts.isArrayLiteralExpression(initializer))
      throw new Error(`${constName} must be a string-literal array.`);
    const values = initializer.elements.flatMap((element) =>
      ts.isStringLiteral(element) ? [element.text] : [],
    );
    if (values.length === 0 || values.length !== initializer.elements.length)
      throw new Error(`${constName} must contain only string literals.`);
    return [...new Set(values)].sort();
  }
  throw new Error(`Could not find ${constName}.`);
}

async function canonicalTriggerNames(cardsDirectory: string): Promise<string[]> {
  const typePath = resolve(cardsDirectory, "../../../types/src/abilities/trigger.ts");
  const source = ts.createSourceFile(
    typePath,
    await readFile(typePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  return constStringArrayMembers(source, "FAB_OBSERVABLE_EVENT_NAMES");
}

function sourcePrintingMetadata(
  cardsDirectory: string,
  path: string,
  card: Readonly<Record<string, unknown>>,
): { readonly set?: string; readonly collectorNumber?: string; readonly slug?: string } {
  const cardPath = relative(resolve(cardsDirectory), path);
  const segments = cardPath.split("/");
  const set = typeof card.set === "string" ? card.set : segments[0];
  const file = segments.at(-1)?.replace(/\.ts$/, "");
  const dash = file?.indexOf("-") ?? -1;
  const collectorNumber =
    typeof card.collectorNumber === "string"
      ? card.collectorNumber
      : file && dash >= 0
        ? file.slice(0, dash)
        : file;
  const slug = file && dash >= 0 ? file.slice(dash + 1) : file;
  return {
    set: set || undefined,
    collectorNumber: collectorNumber || undefined,
    slug: typeof card.slug === "string" ? card.slug : slug || undefined,
  };
}

export async function auditCardBehaviors(
  sourceDirectories: string | readonly string[],
): Promise<CardBehaviorInventory> {
  const directories = (
    Array.isArray(sourceDirectories) ? sourceDirectories : [sourceDirectories]
  ).map((directory) => resolve(directory));
  const cardsDirectory = directories[0]!;
  const files = (
    await Promise.all(
      directories.map(async (directory) => (await walk(directory)).map((path) => ({ path }))),
    )
  ).flat();
  const occurrences: CardBehaviorOccurrence[] = [];
  const keys = new Set<string>();
  for (const { path } of files) {
    const source = ts.createSourceFile(
      path,
      await readFile(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const directCards = cardObjects(source);
    const cards =
      directCards.length > 0
        ? directCards
        : pitchFamilyObject(source)
          ? [pitchFamilyObject(source)!]
          : [];
    for (const card of cards) {
      const printing = sourcePrintingMetadata(cardsDirectory, path, card);
      recordCardBehavior(
        card,
        {
          cardPath: relative(cardsDirectory, path),
          canonicalId: typeof card.canonicalId === "string" ? card.canonicalId : undefined,
          ...printing,
        },
        occurrences,
        keys,
      );
    }
  }
  const canonicalTriggers = await canonicalTriggerNames(cardsDirectory);
  const observedTriggers = new Set(
    occurrences
      .filter((occurrence) => occurrence.kind === "trigger")
      .map((occurrence) => occurrence.behaviorKey),
  );
  for (const trigger of canonicalTriggers) {
    const behaviorKey = `trigger:${trigger}`;
    keys.add(behaviorKey);
    if (!observedTriggers.has(behaviorKey)) {
      occurrences.push({
        cardPath: "../../../types/src/abilities/trigger.ts",
        kind: "trigger",
        behaviorKey,
        sourceId: "../../../types/src/abilities/trigger.ts#FabTriggerEventName:" + trigger,
      });
    }
  }
  return {
    generatedAt: "source-derived",
    cardModules: files.length,
    canonicalTriggerNames: canonicalTriggers,
    behaviorOccurrences: occurrences,
    behaviorKeys: [...keys].sort(),
  };
}

function recordCardBehavior(
  card: Record<string, unknown>,
  base: {
    readonly cardPath: string;
    readonly canonicalId?: string;
    readonly set?: string;
    readonly collectorNumber?: string;
    readonly slug?: string;
  },
  occurrences: CardBehaviorOccurrence[],
  keys: Set<string>,
): void {
  const normalizedBase = {
    cardPath: base.cardPath,
    canonicalId: base.canonicalId,
    set: base.set,
    collectorNumber: base.collectorNumber,
    slug: base.slug,
  };
  const abilities = Array.isArray(card.abilities) ? card.abilities : [];
  abilities.forEach((ability, index) => {
    const key = `ability:${stable(withoutIdentity(ability))}`;
    keys.add(key);
    occurrences.push({
      ...normalizedBase,
      kind: "ability",
      behaviorKey: key,
      sourceId: `${normalizedBase.cardPath}#ability-${index + 1}`,
    });
    const effects = new Set<string>();
    const triggers = new Set<string>();
    collectEffects(ability, effects);
    collectTriggers(ability, triggers);
    for (const effect of effects) {
      const effectKey = `effect:${effect}`;
      keys.add(effectKey);
      occurrences.push({
        ...normalizedBase,
        kind: "effect",
        behaviorKey: effectKey,
        sourceId: `${normalizedBase.cardPath}#ability-${index + 1}:effect-${effect}`,
      });
    }
    for (const trigger of triggers) {
      const triggerKey = `trigger:${trigger}`;
      keys.add(triggerKey);
      occurrences.push({
        ...normalizedBase,
        kind: "trigger",
        behaviorKey: triggerKey,
        sourceId: `${normalizedBase.cardPath}#ability-${index + 1}:trigger-${trigger}`,
      });
    }
  });
  const keywords = new Set<string>();
  collectKeywords(card.keywords, keywords);
  for (const keyword of keywords) {
    const key = `keyword:${keyword}`;
    keys.add(key);
    occurrences.push({
      ...normalizedBase,
      kind: "keyword",
      behaviorKey: key,
      sourceId: `${normalizedBase.cardPath}#keyword-${keyword}`,
    });
  }
}

export function defaultCardsDirectory(): string {
  return resolve(dirname(new URL(import.meta.url).pathname), "../src/cards");
}

export function defaultCardSourceDirectories(): readonly [string] {
  return [defaultCardsDirectory()];
}

export function defaultBehaviorPlansDirectory(): string {
  return resolve(
    dirname(new URL(import.meta.url).pathname),
    "../../engine/src/rules/card-behavior/plans",
  );
}

export function defaultBehaviorProvenDirectory(): string {
  return resolve(
    dirname(new URL(import.meta.url).pathname),
    "../../engine/src/rules/card-behavior/proven",
  );
}

export function defaultBehaviorStatusPath(): string {
  return resolve(
    dirname(new URL(import.meta.url).pathname),
    "../../engine/src/rules/card-behavior/behavior-status.json",
  );
}

export async function readBehaviorStatus(
  path = defaultBehaviorStatusPath(),
): Promise<BehaviorStatusFile> {
  const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid behavior status file.");
  const value = parsed as Record<string, unknown>;
  const statuses: readonly BehaviorStatus[] = ["planned", "proven", "blocked", "out_of_scope"];
  if (value.version !== 1 || !statuses.includes(value.defaultStatus as BehaviorStatus))
    throw new Error("Behavior status file must use version 1 and a valid defaultStatus.");
  if (!value.overrides || typeof value.overrides !== "object" || Array.isArray(value.overrides))
    throw new Error("Behavior status overrides must be an object.");
  for (const [key, status] of Object.entries(value.overrides)) {
    if (!statuses.includes(status as BehaviorStatus))
      throw new Error(`Invalid behavior status for ${key}: ${String(status)}`);
  }
  return {
    version: 1,
    defaultStatus: value.defaultStatus as BehaviorStatus,
    overrides: value.overrides as Readonly<Record<string, BehaviorStatus>>,
  };
}

async function behaviorFiles(directory: string): Promise<readonly string[]> {
  try {
    return (await readdir(directory)).filter((file) => file.endsWith(".test.ts"));
  } catch {
    return [];
  }
}

export async function validateBehaviorTestLayout(
  inventory: CardBehaviorInventory,
  statusPath = defaultBehaviorStatusPath(),
  plansDirectory = defaultBehaviorPlansDirectory(),
  provenDirectory = defaultBehaviorProvenDirectory(),
): Promise<BehaviorLayoutReport> {
  const status = await readBehaviorStatus(statusPath);
  const plans = new Set(await behaviorFiles(plansDirectory));
  const proven = new Set(await behaviorFiles(provenDirectory));
  const provenKeys = new Set<string>();
  for (const file of proven) {
    const content = await readFile(join(provenDirectory, file), "utf8");
    for (const match of content.matchAll(/^ \* Behavior: (.+)$/gm)) provenKeys.add(match[1]!);
  }
  const errors: string[] = [];
  const counts: Record<BehaviorStatus, number> = {
    planned: 0,
    proven: 0,
    blocked: 0,
    out_of_scope: 0,
  };
  for (const key of inventory.behaviorKeys) {
    const generatedFile = `${key.slice(0, key.indexOf(":"))}-${createHash("sha256")
      .update(key)
      .digest("hex")
      .slice(0, 12)}.test.ts`;
    const explicit = status.overrides[key];
    const generatedInProven = proven.has(generatedFile);
    const effective: BehaviorStatus =
      explicit ?? (generatedInProven || provenKeys.has(key) ? "proven" : status.defaultStatus);
    counts[effective] += 1;
    const inPlans = plans.has(generatedFile);
    const inProven = proven.has(generatedFile) || provenKeys.has(key);
    if (inPlans && inProven) errors.push(`${key} exists in both plans and proven.`);
    if (effective === "planned" && !inPlans)
      errors.push(`${key} is planned but has no generated plan file.`);
    if (effective === "proven" && !inProven)
      errors.push(`${key} is proven but has no linked proof file.`);
    if ((effective === "blocked" || effective === "out_of_scope") && (inPlans || inProven))
      errors.push(`${key} is ${effective} but still has a test file.`);
  }
  for (const key of Object.keys(status.overrides)) {
    if (!inventory.behaviorKeys.includes(key))
      errors.push(`Status override has unknown behavior: ${key}`);
  }
  return { errors, counts };
}

function behaviorFileName(key: string): string {
  const kind = key.slice(0, key.indexOf(":"));
  const digest = createHash("sha256").update(key).digest("hex").slice(0, 12);
  return `${kind}-${digest}.test.ts`;
}

/**
 * Create one explicit AAA work item for every normalized behavior key.
 * Generated files are deliberately pending until a production card path is
 * implemented and proven; this prevents inventory rows from becoming false
 * green coverage.
 */
export async function generateBehaviorTestPlans(
  inventory: CardBehaviorInventory,
  outputDirectory: string,
): Promise<number> {
  await mkdir(outputDirectory, { recursive: true });
  const provenDirectory = resolve(outputDirectory, "../proven");
  const representatives = new Map<string, CardBehaviorOccurrence>();
  for (const occurrence of inventory.behaviorOccurrences) {
    if (!representatives.has(occurrence.behaviorKey))
      representatives.set(occurrence.behaviorKey, occurrence);
  }
  for (const key of inventory.behaviorKeys) {
    const representative = representatives.get(key);
    if (!representative) throw new Error(`Missing representative for ${key}`);
    const title = key.replace(/^[^:]+:/, "").replaceAll('"', '\\"');
    const generatedName = behaviorFileName(key);
    try {
      await readFile(join(provenDirectory, generatedName), "utf8");
      continue;
    } catch {
      // No promoted generated proof exists; retain the plan in the inventory.
    }
    const content = `/**\n * GENERATED AAA PLAN — do not mark complete without production proof.\n * Behavior: ${key}\n * Representative card: ${representative.cardPath}\n * Canonical id: ${representative.canonicalId ?? "unknown"}\n *\n * Arrange: import the representative real card and build a legal,\n * player-reachable match with FabTestEngine.start(...), addressing each seat\n * through a hero handle (const Attacker = game.as(hero)) with the required\n * zones, resources, targets, counters, and opponent responses.\n * Act: drive the match on the fluent test surface only —\n * handle.attackWith(...), handle.defendWith(...), handle.activate(...),\n * handle.expectBlockRejected(...), and game.helpers.* (attackToDefend,\n * resolveRestOfCombat, expectStep, logHas). Harness defaults auto-pass\n * priority, auto-pitch, and float resources; pass resourcePoints: 0 in the\n * player setup to test pitching or cost-insufficiency.\n * Assert: verify player-visible outcomes such as life, zones, AP/resources,\n * combat state, prompts, legality error codes, or game result. Include the\n * negative/boundary case and any timing or interaction case before completion.\n */\nimport { describe, it } from "vitest";\n\ndescribe(${JSON.stringify(`${representative.kind}: ${title}`)}, () => {\n  it.todo(${JSON.stringify(`AAA production behavior: ${title}`)});\n});\n`;
    try {
      await writeFile(join(outputDirectory, generatedName), content, {
        encoding: "utf8",
        flag: "wx",
      });
    } catch (error: unknown) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "EEXIST"))
        throw error;
    }
  }
  return inventory.behaviorKeys.length;
}

if (process.argv[1]?.endsWith("behavior-audit.ts")) {
  const inventory = await auditCardBehaviors(process.argv[2] ?? defaultCardSourceDirectories());
  if (process.argv[3] === "--generate-tests") {
    const count = await generateBehaviorTestPlans(
      inventory,
      process.argv[4] ?? defaultBehaviorPlansDirectory(),
    );
    process.stdout.write(`Generated ${count} AAA behavior test plans.\n`);
  } else {
    process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
  }
}
