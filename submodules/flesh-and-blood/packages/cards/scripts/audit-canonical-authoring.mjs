#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_PACKAGE_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");

const ALLOWED_CARD_DIRECTORIES = new Set([
  "actions",
  "allies",
  "attack-reactions",
  "blocks",
  "companions",
  "conditions",
  "defense-reactions",
  "demi-heroes",
  "equipment",
  "events",
  "heroes",
  "instants",
  "macros",
  "mentors",
  "placeholders",
  "resources",
  "shared",
  "tokens",
  "weapons",
]);

const LEGACY_ARTIFACT_PATHS = [
  "src/cards/shared/pitch-cycle.ts",
  "src/generated/pitch-families.generated.ts",
  "scripts/generate-pitch-family-identities.ts",
  "scripts/generate-pitch-family-collectors.d.mts",
  "scripts/migrate-canonical-card-layout.mjs",
  "scripts/migrate-canonical-card-layout.node-test.mjs",
];

const COLLECTOR_ABILITY_ID =
  /^[A-Z0-9]{2,6}\d{3,4}(?:(?:-face-\d+)|(?:-front)|(?:-back))?-a\d+[a-z]?(?:-|$)/;
const COLLECTOR_FILENAME = /(?:^|\/)[A-Z0-9]{2,6}\d{3,4}(?:-|\.|\/)/;
const FORBIDDEN_DIRECT_FACTORIES = new Set([
  "defineFleshAndBloodCard",
  "defineFleshAndBloodCardUnchecked",
  "definePitchPrinting",
]);
const RULES_ONLY_ABILITY_HELPERS = new Set([
  "bondAbility",
  "comboAbility",
  "comboResolution",
  "comboStatic",
  "crushAbility",
  "highTideAbility",
  "lightningFlowAbility",
  "modalAbility",
  "repriseAbility",
  "ruptureAbility",
  "semanticModalAbility",
  "surgeAbility",
]);
const FORBIDDEN_PRINTING_PROPERTIES = new Set([
  "artist",
  "artworkId",
  "collectorNumber",
  "finish",
  "imageUrl",
  "legality",
  "printingId",
  "rarity",
  "set",
  "setCode",
]);
const AST_DUMP_SEMANTIC_KEY = /^(?:resolution|static)[A-Z]/;
const MAX_SEMANTIC_KEY_LENGTH = 64;

function walkFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? walkFiles(file) : [file];
  });
}

function normalizedRelative(packageRoot, file) {
  return path.relative(packageRoot, file).replaceAll(path.sep, "/");
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function stringProperty(object, name) {
  const property = object.properties.find(
    (candidate) => ts.isPropertyAssignment(candidate) && propertyName(candidate.name) === name,
  );
  return property &&
    ts.isPropertyAssignment(property) &&
    ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : undefined;
}

function location(source, node, file) {
  const point = source.getLineAndCharacterOfPosition(node.getStart(source));
  return { file, line: point.line + 1, column: point.character + 1 };
}

function isExecutableCardModule(relativeFile) {
  return (
    relativeFile.startsWith("src/cards/") &&
    relativeFile.endsWith(".ts") &&
    !relativeFile.endsWith(".test.ts") &&
    !relativeFile.endsWith(".i18n.ts")
  );
}

function category(items) {
  return { count: items.length, items };
}

function isDirectSemanticAbilityMapMember(node) {
  if (!ts.isObjectLiteralExpression(node.parent)) return false;
  let body = node.parent;
  if (ts.isParenthesizedExpression(body.parent)) body = body.parent;
  return (
    ts.isArrowFunction(body.parent) &&
    ts.isPropertyAssignment(body.parent.parent) &&
    propertyName(body.parent.parent.name) === "abilities"
  );
}

function isDirectSemanticAbilityObject(node) {
  if (!ts.isObjectLiteralExpression(node) || !ts.isPropertyAssignment(node.parent)) return false;
  if (!ts.isObjectLiteralExpression(node.parent.parent)) return false;
  let body = node.parent.parent;
  if (ts.isParenthesizedExpression(body.parent)) body = body.parent;
  return (
    ts.isArrowFunction(body.parent) &&
    ts.isPropertyAssignment(body.parent.parent) &&
    propertyName(body.parent.parent.name) === "abilities"
  );
}

function isKeyedSemanticModeObject(node) {
  return (
    ts.isObjectLiteralExpression(node) &&
    ts.isPropertyAssignment(node.parent) &&
    ts.isObjectLiteralExpression(node.parent.parent) &&
    ts.isPropertyAssignment(node.parent.parent.parent) &&
    propertyName(node.parent.parent.parent.name) === "modes"
  );
}

function isRulesOnlyAbilityHelperArgument(node) {
  if (
    !ts.isObjectLiteralExpression(node) ||
    !ts.isCallExpression(node.parent) ||
    !ts.isIdentifier(node.parent.expression) ||
    !RULES_ONLY_ABILITY_HELPERS.has(node.parent.expression.text)
  ) {
    return false;
  }
  const call = node.parent;
  if (!ts.isPropertyAssignment(call.parent) || !ts.isObjectLiteralExpression(call.parent.parent)) {
    return false;
  }
  let body = call.parent.parent;
  if (ts.isParenthesizedExpression(body.parent)) body = body.parent;
  return (
    ts.isArrowFunction(body.parent) &&
    ts.isPropertyAssignment(body.parent.parent) &&
    propertyName(body.parent.parent.name) === "abilities"
  );
}

function unwrapParentheses(node) {
  let current = node;
  while (ts.isParenthesizedExpression(current)) current = current.expression;
  return current;
}

function isInlineLocalizationOverrides(initializer) {
  let value = unwrapParentheses(initializer);
  if (ts.isArrowFunction(value)) value = unwrapParentheses(value.body);
  if (!ts.isObjectLiteralExpression(value)) return false;
  if (
    value.properties.some(
      (property) =>
        !ts.isPropertyAssignment(property) ||
        !ts.isObjectLiteralExpression(unwrapParentheses(property.initializer)),
    )
  ) {
    return false;
  }
  let safe = true;
  const visit = (node) => {
    if (ts.isSpreadAssignment(node) || ts.isShorthandPropertyAssignment(node)) safe = false;
    if (
      ts.isPropertyAssignment(node) &&
      propertyName(node.name) === "modes" &&
      !ts.isObjectLiteralExpression(unwrapParentheses(node.initializer))
    ) {
      safe = false;
    }
    ts.forEachChild(node, visit);
  };
  visit(value);
  return safe;
}

export function auditCanonicalAuthoring({ packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  const cardsRoot = path.join(packageRoot, "src", "cards");
  const sourceFiles = walkFiles(cardsRoot).filter((file) => file.endsWith(".ts"));
  const definePitchPrinting = [];
  const directDefineFleshAndBloodCard = [];
  const executablePrintingMetadata = [];
  const nonemptyAbilityText = [];
  const collectorDerivedAbilityIds = [];
  const blankNestedAbilityIds = [];
  const positionalAbilityCollections = [];
  const placeholderSemanticKeys = [];
  const astDumpSemanticKeys = [];
  const redundantAbilityAuthoringFields = [];
  const untypedLocalizationOverrides = [];
  const legacyImports = [];
  const legacyFactoryDefinitions = [];

  for (const absoluteFile of sourceFiles) {
    const file = normalizedRelative(packageRoot, absoluteFile);
    const source = ts.createSourceFile(
      absoluteFile,
      readFileSync(absoluteFile, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const executable = isExecutableCardModule(file);
    const directFactoryBindings = new Map();
    const factoryNamespaces = new Set();
    const familyI18nBindings = new Set();
    const familyI18nNamespaces = new Set();
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
      const moduleSpecifier = ts.isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : "";
      const bindings = statement.importClause.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) factoryNamespaces.add(bindings.name.text);
      if (
        bindings &&
        ts.isNamespaceImport(bindings) &&
        moduleSpecifier.endsWith("family-i18n.ts")
      ) {
        familyI18nNamespaces.add(bindings.name.text);
      }
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          const imported = element.propertyName?.text ?? element.name.text;
          if (FORBIDDEN_DIRECT_FACTORIES.has(imported)) {
            directFactoryBindings.set(element.name.text, imported);
          }
          if (moduleSpecifier.endsWith("family-i18n.ts") && imported === "defineFamilyI18n") {
            familyI18nBindings.add(element.name.text);
          }
        }
      }
    }

    const isTypedFamilyI18nCall = (node) =>
      ts.isCallExpression(node) &&
      ((ts.isIdentifier(node.expression) && familyI18nBindings.has(node.expression.text)) ||
        (ts.isPropertyAccessExpression(node.expression) &&
          node.expression.name.text === "defineFamilyI18n" &&
          ts.isIdentifier(node.expression.expression) &&
          familyI18nNamespaces.has(node.expression.expression.text)));
    const isWithinTypedFamilyI18n = (node) => {
      for (let current = node.parent; current; current = current.parent) {
        if (isTypedFamilyI18nCall(current)) return true;
      }
      return false;
    };

    const visit = (node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const specifier = node.moduleSpecifier.text;
        if (
          specifier.includes("/families/") ||
          /\/(?:WTR|ARC|CRU|MON|ELE|EVR|DYN|UPR|OUT|DTD|EVO|MST|ROS|HNT|SEA)\//.test(
            `/${specifier}/`,
          ) ||
          COLLECTOR_FILENAME.test(specifier)
        ) {
          legacyImports.push({ ...location(source, node, file), specifier });
        }
      }

      if (ts.isFunctionDeclaration(node) && node.name?.text === "definePitchPrinting") {
        legacyFactoryDefinitions.push({
          ...location(source, node, file),
          name: node.name.text,
        });
      }

      if (executable && ts.isCallExpression(node)) {
        const directFactory = ts.isIdentifier(node.expression)
          ? (directFactoryBindings.get(node.expression.text) ??
            (FORBIDDEN_DIRECT_FACTORIES.has(node.expression.text)
              ? node.expression.text
              : undefined))
          : ts.isPropertyAccessExpression(node.expression) &&
              ts.isIdentifier(node.expression.expression) &&
              factoryNamespaces.has(node.expression.expression.text) &&
              FORBIDDEN_DIRECT_FACTORIES.has(node.expression.name.text)
            ? node.expression.name.text
            : undefined;
        if (directFactory === "definePitchPrinting") {
          const entry = {
            ...location(source, node, file),
            canonicalId: undefined,
          };
          const argument = node.arguments[0];
          if (argument && ts.isObjectLiteralExpression(argument)) {
            entry.canonicalId = stringProperty(argument, "canonicalId");
          }
          definePitchPrinting.push(entry);
        }
        if (
          directFactory === "defineFleshAndBloodCard" ||
          directFactory === "defineFleshAndBloodCardUnchecked"
        ) {
          directDefineFleshAndBloodCard.push(location(source, node, file));
        }
      }

      if (ts.isPropertyAssignment(node)) {
        const name = propertyName(node.name);
        if (
          file.endsWith(".i18n.ts") &&
          name === "abilities" &&
          (!isWithinTypedFamilyI18n(node) || !isInlineLocalizationOverrides(node.initializer))
        ) {
          untypedLocalizationOverrides.push(location(source, node, file));
        }
        if (executable && name && FORBIDDEN_PRINTING_PROPERTIES.has(name)) {
          executablePrintingMetadata.push({
            ...location(source, node, file),
            property: name,
            value: ts.isStringLiteralLike(node.initializer)
              ? node.initializer.text
              : node.initializer.getText(source),
          });
        }

        if (executable && name === "id" && ts.isStringLiteralLike(node.initializer)) {
          const id = node.initializer.text;
          if (COLLECTOR_ABILITY_ID.test(id)) {
            collectorDerivedAbilityIds.push({
              ...location(source, node, file),
              id,
            });
          }
        }

        if (
          executable &&
          name === "text" &&
          ts.isStringLiteralLike(node.initializer) &&
          node.initializer.text
        ) {
          nonemptyAbilityText.push({
            ...location(source, node, file),
            id: ts.isObjectLiteralExpression(node.parent)
              ? (stringProperty(node.parent, "id") ?? stringProperty(node.parent, "faceId"))
              : undefined,
            text: node.initializer.text,
          });
        }

        if (
          executable &&
          (name === "id" || name === "text") &&
          ts.isObjectLiteralExpression(node.parent) &&
          (isDirectSemanticAbilityObject(node.parent) ||
            isKeyedSemanticModeObject(node.parent) ||
            isRulesOnlyAbilityHelperArgument(node.parent))
        ) {
          redundantAbilityAuthoringFields.push({
            ...location(source, node, file),
            field: name,
          });
        }

        const semanticAbilityMapMember = executable && isDirectSemanticAbilityMapMember(node);
        const authoredLayoutFace =
          name === "abilities" &&
          ts.isObjectLiteralExpression(node.parent) &&
          node.parent.properties.some(
            (property) =>
              ts.isPropertyAssignment(property) && propertyName(property.name) === "typeText",
          ) &&
          node.parent.properties.some(
            (property) =>
              ts.isPropertyAssignment(property) && propertyName(property.name) === "types",
          );
        if (
          executable &&
          ts.isArrayLiteralExpression(node.initializer) &&
          !authoredLayoutFace &&
          (name === "abilities" ||
            semanticAbilityMapMember ||
            (name === "modes" &&
              ts.isObjectLiteralExpression(node.parent) &&
              stringProperty(node.parent, "kind") === "modal"))
        ) {
          positionalAbilityCollections.push({
            ...location(source, node, file),
            key: name,
          });
        }
        if (
          executable &&
          (name === "main" || /^ability\d+$/.test(name ?? "")) &&
          semanticAbilityMapMember
        ) {
          placeholderSemanticKeys.push({
            ...location(source, node, file),
            key: name,
          });
        }
        if (
          executable &&
          name &&
          semanticAbilityMapMember &&
          AST_DUMP_SEMANTIC_KEY.test(name) &&
          name.length > MAX_SEMANTIC_KEY_LENGTH
        ) {
          astDumpSemanticKeys.push({
            ...location(source, node, file),
            key: name,
            length: name.length,
          });
        }
      }

      if (
        file.endsWith(".i18n.ts") &&
        ((ts.isShorthandPropertyAssignment(node) && node.name.text === "abilities") ||
          ts.isSpreadAssignment(node))
      ) {
        untypedLocalizationOverrides.push(location(source, node, file));
      }

      if (
        executable &&
        ts.isObjectLiteralExpression(node) &&
        stringProperty(node, "id") === "" &&
        ts.isPropertyAssignment(node.parent) &&
        propertyName(node.parent.name) === "ability" &&
        ts.isObjectLiteralExpression(node.parent.parent) &&
        stringProperty(node.parent.parent, "kind") === "ability"
      ) {
        blankNestedAbilityIds.push(location(source, node, file));
      }

      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  const legacyCardPaths = sourceFiles.flatMap((absoluteFile) => {
    const file = normalizedRelative(packageRoot, absoluteFile);
    const belowCards = file.slice("src/cards/".length);
    const [directory] = belowCards.split("/");
    const isRootBarrel = !belowCards.includes("/");
    if (
      !file.startsWith("src/cards/") ||
      !directory ||
      (!isRootBarrel && !ALLOWED_CARD_DIRECTORIES.has(directory) && file.endsWith(".ts")) ||
      file.includes("/families/") ||
      COLLECTOR_FILENAME.test(file)
    ) {
      return [{ file }];
    }
    return [];
  });

  const forbiddenMigrationScripts = walkFiles(path.join(packageRoot, "scripts"))
    .map((file) => normalizedRelative(packageRoot, file))
    .filter((file) => /(?:^|[-.])migrat(?:e|ion)(?:[-.]|$)/i.test(path.basename(file)));
  const legacyArtifacts = [
    ...new Set([
      ...LEGACY_ARTIFACT_PATHS.filter((file) => existsSync(path.join(packageRoot, file))),
      ...forbiddenMigrationScripts,
    ]),
  ].map((file) => ({ file }));

  const issues = {
    definePitchPrinting: category(definePitchPrinting),
    directDefineFleshAndBloodCard: category(directDefineFleshAndBloodCard),
    executablePrintingMetadata: category(executablePrintingMetadata),
    nonemptyAbilityText: category(nonemptyAbilityText),
    collectorDerivedAbilityIds: category(collectorDerivedAbilityIds),
    blankNestedAbilityIds: category(blankNestedAbilityIds),
    positionalAbilityCollections: category(positionalAbilityCollections),
    placeholderSemanticKeys: category(placeholderSemanticKeys),
    astDumpSemanticKeys: category(astDumpSemanticKeys),
    redundantAbilityAuthoringFields: category(redundantAbilityAuthoringFields),
    untypedLocalizationOverrides: category(untypedLocalizationOverrides),
    legacyCardPaths: category(legacyCardPaths),
    legacyImports: category(legacyImports),
    legacyFactoryDefinitions: category(legacyFactoryDefinitions),
    legacyArtifacts: category(legacyArtifacts),
  };
  const totalIssues = Object.values(issues).reduce((total, entry) => total + entry.count, 0);

  return {
    ok: totalIssues === 0,
    packageRoot,
    scannedExecutableModules: sourceFiles
      .map((file) => normalizedRelative(packageRoot, file))
      .filter(isExecutableCardModule).length,
    totalIssues,
    counts: Object.fromEntries(Object.entries(issues).map(([name, entry]) => [name, entry.count])),
    issues,
  };
}

export function parseArguments(argv) {
  const strict = argv.includes("--strict");
  const packageRootIndex = argv.indexOf("--package-root");
  const packageRoot =
    packageRootIndex >= 0 && argv[packageRootIndex + 1]
      ? path.resolve(argv[packageRootIndex + 1])
      : DEFAULT_PACKAGE_ROOT;
  return { strict, packageRoot };
}

export function run(argv = process.argv.slice(2)) {
  const { strict, packageRoot } = parseArguments(argv);
  const report = auditCanonicalAuthoring({ packageRoot });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  return strict && !report.ok ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  process.exitCode = run();
}
