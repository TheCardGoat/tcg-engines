#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { format } from "oxfmt";
import { typeBoxFromTokens } from "../../types/src/normalize-base-object-properties.ts";

import cardDataJson from "../src/generated/flesh-and-blood-card-data.json" with { type: "json" };
import { buildExpectedCanonicalManifest } from "./generate-canonical-card-manifest.mjs";

const packageRoot = path.resolve(import.meta.dirname, "..");
const generatedRoot = path.join(packageRoot, "src/generated");
const outputRoot = path.join(generatedRoot, "card-identities");

const PITCH_BY_COLOR = { red: "1", yellow: "2", blue: "3" };
const PITCH_FAMILY_PRIMARY_TYPES = new Set([
  "Action",
  "Attack Reaction",
  "Defense Reaction",
  "Instant",
  "Block",
]);
const IDENTITY_FIELDS = [
  "canonicalId",
  "slug",
  "typeBox",
  "traits",
  "color",
  "pitch",
  "cost",
  "power",
  "defense",
  "health",
  "intelligence",
  "arcane",
];
const PITCH_FAMILY_NUMERIC_FIELDS = [
  "cost",
  "power",
  "defense",
  "health",
  "intelligence",
  "arcane",
];

function compactIdentity(card) {
  const compact = Object.fromEntries(
    IDENTITY_FIELDS.flatMap((field) => (card[field] === undefined ? [] : [[field, card[field]]])),
  );
  compact.typeBox = typeBoxFromTokens(card.types, card.supertypeSets);
  return compact;
}

function pitchVariantKey(card, primaryType) {
  if (!PITCH_FAMILY_PRIMARY_TYPES.has(primaryType)) return undefined;
  const color = String(card.color ?? "").toLowerCase();
  return PITCH_BY_COLOR[color] === String(card.pitch) ? color : undefined;
}

export function buildCardIdentityModel(catalog, manifest) {
  const cardsById = new Map(catalog.cards.map((card) => [card.canonicalId, card]));
  const identities = {};
  const entriesByModule = Map.groupBy(manifest, (entry) => entry.module);
  const units = {};
  for (const entry of manifest) {
    const card = cardsById.get(entry.canonicalId);
    if (!card) throw new Error(`Manifest identity ${entry.canonicalId} is absent from catalog`);
    identities[entry.canonicalId] = {
      ...compactIdentity(card),
      primaryType: entry.primaryType,
      unitKey: entry.module.replace(/^cards\//, "").replace(/\.ts$/, ""),
    };
  }
  for (const [module, entries] of entriesByModule) {
    const unitKey = module.replace(/^cards\//, "").replace(/\.ts$/, "");
    const variants = {};
    let pitchFamily = true;
    for (const entry of entries) {
      const card = cardsById.get(entry.canonicalId);
      const variantKey = pitchVariantKey(card, entry.primaryType);
      if (!variantKey || variants[variantKey]) pitchFamily = false;
      else variants[variantKey] = entry.canonicalId;
    }
    units[unitKey] = pitchFamily
      ? { kind: "pitch", familyKey: entries[0].stableFamilyKey, variants }
      : entries.length === 1
        ? { kind: "singleton", identity: entries[0].canonicalId }
        : {
            kind: "variant",
            familyKey: entries[0].stableFamilyKey,
            variants: Object.fromEntries(
              entries.map((entry) => [cardsById.get(entry.canonicalId).slug, entry.canonicalId]),
            ),
          };
  }
  const pitchFamilies = Object.fromEntries(
    Object.values(units)
      .filter((unit) => unit.kind === "pitch")
      .map((unit) => {
        const variants = Object.fromEntries(
          Object.entries(unit.variants).map(([color, canonicalId]) => [
            color,
            identities[canonicalId],
          ]),
        );
        const variantIdentities = Object.values(variants);
        const first = variantIdentities[0];
        if (!first) throw new Error(`Pitch family ${unit.familyKey} has no variants`);
        const slug = first.slug.replace(/-(red|yellow|blue)$/, "");
        if (
          variantIdentities.some(
            (identity) => identity.slug.replace(/-(red|yellow|blue)$/, "") !== slug,
          )
        ) {
          throw new Error(`Pitch family ${unit.familyKey} has inconsistent variant slugs`);
        }
        const shared = { typeBox: first.typeBox };
        if (first.traits?.length > 0) shared.traits = first.traits;
        for (const field of PITCH_FAMILY_NUMERIC_FIELDS) {
          const value = first[field];
          if (
            value !== undefined &&
            variantIdentities.every((identity) => identity[field] === value)
          ) {
            shared[field] = value;
          }
        }
        return [
          slug,
          {
            slug,
            shared,
            variants: Object.fromEntries(
              Object.entries(variants).map(([color, identity]) => [
                color,
                {
                  canonicalId: identity.canonicalId,
                  slug: identity.slug,
                  ...Object.fromEntries(
                    PITCH_FAMILY_NUMERIC_FIELDS.flatMap((field) =>
                      identity[field] !== undefined && identity[field] !== shared[field]
                        ? [[field, identity[field]]]
                        : [],
                    ),
                  ),
                },
              ]),
            ),
          },
        ];
      })
      .sort(([left], [right]) => left.localeCompare(right)),
  );
  return { identities, units, pitchFamilies };
}

function referencedKeys(source, symbol) {
  const keys = new Set();
  const bracketPattern = new RegExp(`${symbol}\\s*\\[\\s*["']([^"']+)["']\\s*\\]`, "g");
  for (const match of source.matchAll(bracketPattern)) keys.add(match[1]);
  const propertyPattern = new RegExp(`${symbol}\\s*\\.\\s*([A-Za-z_$][A-Za-z0-9_$]*)`, "g");
  for (const match of source.matchAll(propertyPattern)) keys.add(match[1]);
  return [...keys].sort((a, b) => String(a).localeCompare(String(b)));
}

function runtimeIdentity(identity) {
  const { primaryType: _primaryType, unitKey: _unitKey, ...runtime } = identity;
  return runtime;
}

export function renderCardIdentityModule({ identities, pitchFamilies }) {
  const sections = ["// Generated by scripts/generate-card-identities.mjs. Do not edit."];
  if (Object.keys(identities).length > 0) {
    sections.push('import type { CanonicalCardIdentity } from "../../../authoring/card.ts";');
  }
  if (Object.keys(pitchFamilies).length > 0) {
    sections.push('import type { PitchFamilyIdentity } from "../../../authoring/pitch-family.ts";');
  }
  if (Object.keys(identities).length > 0) {
    sections.push(
      `export const fabCardIdentitiesByCanonicalId = ${JSON.stringify(identities, null, 2)} as const satisfies Readonly<Record<string, CanonicalCardIdentity>>;`,
    );
  }
  if (Object.keys(pitchFamilies).length > 0) {
    const catalogType = Object.entries(pitchFamilies)
      .map(([familyKey, family]) => {
        const colors = Object.keys(family.variants).map(JSON.stringify).join(" | ");
        return `  readonly ${JSON.stringify(familyKey)}: PitchFamilyIdentity<${colors}>;`;
      })
      .join("\n");
    sections.push(
      `type FabPitchFamilyCatalog = {\n${catalogType}\n};\n\nexport const fabPitchFamilies: FabPitchFamilyCatalog = ${JSON.stringify(pitchFamilies, null, 2)};`,
    );
  }
  return `${sections.join("\n\n")}\n`;
}

export async function buildCardIdentityModuleOutputs(model, manifest, sourceRoot) {
  const outputs = new Map();
  for (const module of [...new Set(manifest.map((entry) => entry.module))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  )) {
    const source = readFileSync(path.join(sourceRoot, module), "utf8");
    const identityKeys = referencedKeys(source, "fabCardIdentitiesByCanonicalId");
    const familyKeys = referencedKeys(source, "fabPitchFamilies");
    const identities = Object.fromEntries(
      identityKeys.map((canonicalId) => {
        const identity = model.identities[canonicalId];
        if (!identity) throw new Error(`${module} references unknown identity ${canonicalId}`);
        return [canonicalId, runtimeIdentity(identity)];
      }),
    );
    const pitchFamilies = Object.fromEntries(
      familyKeys.map((familyKey) => {
        const family = model.pitchFamilies[familyKey];
        if (!family) throw new Error(`${module} references unknown pitch family ${familyKey}`);
        return [familyKey, family];
      }),
    );
    if (identityKeys.length === 0 && familyKeys.length === 0) continue;
    const relativeModule = module.replace(/^cards\//, "").replace(/\.ts$/, ".generated.ts");
    const rendered = renderCardIdentityModule({ identities, pitchFamilies });
    const formatted = await format(relativeModule, rendered);
    if (formatted.errors.length > 0) {
      throw new Error(
        `Failed to format generated identity module ${relativeModule}: ${formatted.errors
          .map((error) => error.message)
          .join(", ")}`,
      );
    }
    outputs.set(relativeModule, formatted.code);
  }
  return outputs;
}

function generatedFiles(root, prefix = "") {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    return entry.isDirectory() ? generatedFiles(path.join(root, entry.name), relative) : [relative];
  });
}

const catalog = cardDataJson;
const { manifest } = buildExpectedCanonicalManifest({
  catalog,
  sourceRoot: path.join(packageRoot, "src"),
});
const outputs = await buildCardIdentityModuleOutputs(
  buildCardIdentityModel(catalog, manifest),
  manifest,
  path.join(packageRoot, "src"),
);
if (process.argv.includes("--check")) {
  const stale = [...outputs].filter(
    ([relative, output]) =>
      !existsSync(path.join(outputRoot, relative)) ||
      readFileSync(path.join(outputRoot, relative), "utf8") !== output,
  );
  const unexpected = generatedFiles(outputRoot).filter((relative) => !outputs.has(relative));
  if (stale.length > 0 || unexpected.length > 0) {
    throw new Error(
      `generated/card-identities is stale; run generate:card-identities (${[
        ...stale.map(([relative]) => relative),
        ...unexpected,
      ].join(", ")})`,
    );
  }
} else {
  if (existsSync(outputRoot)) rmSync(outputRoot, { recursive: true });
  for (const [relative, output] of outputs) {
    const outputPath = path.join(outputRoot, relative);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, output);
  }
}
