#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { grandArchiveCards } from "../src/generated/grand-archive-card-registry.ts";
import {
  centralKeywordEvidence,
  centralKeywordSuites,
  validateCentralKeywordEvidence,
} from "./card-coverage/central-keywords.ts";
import {
  selectNextGrandArchiveGapCluster,
  type GrandArchiveGapFamily,
} from "./card-coverage/select-next-cluster.ts";
import {
  parseGrandArchiveTestMarkers,
  type GrandArchiveTestMarkers,
} from "./card-coverage/test-markers.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = dirname(HERE);
const CARDS_ROOT = join(PACKAGE_ROOT, "src/cards");
const REPORT_PATH = join(HERE, "card-coverage/coverage.json");
const GAPS_PATH = join(HERE, "card-coverage/gaps.json");

interface SourceCard {
  readonly canonicalId: string;
  readonly path: string;
  readonly testPath: string;
}

interface GapFile {
  readonly version: 1;
  readonly families: readonly GrandArchiveGapFamily[];
}

interface AbilityRow {
  readonly abilityId: string;
  readonly text: string;
  readonly signature: readonly string[];
  readonly status: "proven" | "centrally-covered" | "blocked" | "out-of-scope" | "untested";
  readonly centralEvidence?: NonNullable<ReturnType<typeof centralKeywordEvidence>>;
  readonly gapFamily?: string;
}

async function walk(root: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

function abilitySignatures(value: unknown): readonly string[] {
  const signatures = new Set<string>();
  const visit = (child: unknown, key?: string): void => {
    if (Array.isArray(child)) {
      for (const item of child) visit(item, key);
      return;
    }
    if (!child || typeof child !== "object") return;
    const record = child as Record<string, unknown>;
    if ((key === "effect" || key === "effects") && typeof record.kind === "string")
      signatures.add(`effect:${record.kind}`);
    if ((key === "cost" || key === "costs") && typeof record.kind === "string")
      signatures.add(`cost:${record.kind}`);
    if ((key === "condition" || key === "conditions") && typeof record.kind === "string")
      signatures.add(`condition:${record.kind}`);
    if (
      (key === "filter" || key === "filters" || key === "sourceFilter") &&
      typeof record.kind === "string"
    )
      signatures.add(`filter:${record.kind}`);
    if (key === "duration" && typeof record.kind === "string")
      signatures.add(`duration:${record.kind}`);
    if (key === "restrictions" && typeof record.kind === "string") {
      signatures.add(`restriction:${typeof record.name === "string" ? record.name : record.kind}`);
    }
    if (record.kind === "rule-modification") {
      if (typeof record.mode === "string") signatures.add(`rule-mode:${record.mode}`);
      if (typeof record.action === "string") signatures.add(`rule-action:${record.action}`);
      if (typeof record.costKind === "string") signatures.add(`cost-kind:${record.costKind}`);
    }
    if (key === "trigger" && typeof record.kind === "string") {
      signatures.add(`trigger:${record.kind}`);
      const event = record.event;
      if (event && typeof event === "object" && "name" in event && typeof event.name === "string") {
        signatures.add(`event:${event.name}`);
      }
    }
    if (typeof record.name === "string" && key === "keyword")
      signatures.add(`keyword:${record.name}`);
    for (const [nestedKey, nested] of Object.entries(record)) visit(nested, nestedKey);
  };
  visit(value);
  return [...signatures].sort();
}

async function sourceCards(): Promise<Map<string, SourceCard>> {
  const sources = new Map<string, SourceCard>();
  for (const path of await walk(CARDS_ROOT)) {
    if (!path.endsWith(".ts") || path.endsWith(".test.ts") || path.endsWith("/index.ts")) continue;
    const text = await readFile(path, "utf8");
    const canonicalId = /canonicalId:\s*"([^"]+)"/u.exec(text)?.[1];
    if (!canonicalId) continue;
    sources.set(canonicalId, {
      canonicalId,
      path: relative(PACKAGE_ROOT, path),
      testPath: relative(PACKAGE_ROOT, path.replace(/\.ts$/u, ".test.ts")),
    });
  }
  return sources;
}

async function testMarkers(testPath: string): Promise<GrandArchiveTestMarkers> {
  try {
    const text = await readFile(join(PACKAGE_ROOT, testPath), "utf8");
    return parseGrandArchiveTestMarkers(testPath, text);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { cards: new Set(), abilities: new Set() };
    }
    throw error;
  }
}

function gapFor(
  gaps: readonly GrandArchiveGapFamily[],
  canonicalId: string,
  abilityId: string,
): GrandArchiveGapFamily | undefined {
  return gaps.find(
    (family) =>
      family.status !== "resolved" &&
      family.members.some(
        (member) => member.canonicalId === canonicalId && member.abilityIds.includes(abilityId),
      ),
  );
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const sources = await sourceCards();
  const gaps = JSON.parse(await readFile(GAPS_PATH, "utf8")) as GapFile;
  validateCentralKeywordEvidence(
    Object.fromEntries(
      await Promise.all(
        centralKeywordSuites.map(async (testPath) => [
          testPath,
          await readFile(join(PACKAGE_ROOT, testPath), "utf8"),
        ]),
      ),
    ),
  );

  let provenAbilities = 0;
  let centrallyCoveredAbilities = 0;
  let blockedAbilities = 0;
  let outOfScopeAbilities = 0;
  let coveredCardsWithoutAbilities = 0;
  const cards = [];
  for (const card of grandArchiveCards) {
    const source = sources.get(card.canonicalId);
    if (!source) throw new Error(`No source module for ${card.canonicalId}.`);
    const markers = await testMarkers(source.testPath);
    const faces =
      card.layout.kind === "single-faced"
        ? [card.layout.face]
        : [card.layout.defaultFace, card.layout.flipFace];
    const printedAbilityIds = new Set<string>(
      faces.flatMap((face) => face.abilities.map((ability) => ability.id)),
    );
    for (const marker of markers.abilities) {
      if (!printedAbilityIds.has(marker)) {
        throw new Error(`${source.testPath} claims unknown ability ${marker}.`);
      }
    }
    for (const marker of markers.cards) {
      if (marker !== card.canonicalId) {
        throw new Error(`${source.testPath} claims unrelated card ${marker}.`);
      }
      if (printedAbilityIds.size > 0) {
        throw new Error(
          `${source.testPath} uses @covers-card for a card with executable abilities.`,
        );
      }
    }
    const abilities: AbilityRow[] = faces.flatMap((face) =>
      face.abilities.map((ability): AbilityRow => {
        const gap = gapFor(gaps.families, card.canonicalId, ability.id);
        if (markers.abilities.has(ability.id)) {
          provenAbilities += 1;
          return {
            abilityId: ability.id,
            text: ability.text,
            signature: [
              ability.kind,
              ...(ability.kind === "static" ? [`static:${ability.staticKind}`] : []),
              ...abilitySignatures(ability),
            ],
            status: "proven",
          };
        }
        if (gap?.kind === "out-of-scope") {
          outOfScopeAbilities += 1;
          return {
            abilityId: ability.id,
            text: ability.text,
            signature: [
              ability.kind,
              ...(ability.kind === "static" ? [`static:${ability.staticKind}`] : []),
              ...abilitySignatures(ability),
            ],
            status: "out-of-scope",
            gapFamily: gap.family,
          };
        }
        if (gap) {
          blockedAbilities += 1;
          return {
            abilityId: ability.id,
            text: ability.text,
            signature: [
              ability.kind,
              ...(ability.kind === "static" ? [`static:${ability.staticKind}`] : []),
              ...abilitySignatures(ability),
            ],
            status: "blocked",
            gapFamily: gap.family,
          };
        }
        const centralEvidence = centralKeywordEvidence(ability);
        if (centralEvidence) {
          centrallyCoveredAbilities += 1;
          return {
            abilityId: ability.id,
            text: ability.text,
            signature: [ability.kind, ...abilitySignatures(ability)],
            status: "centrally-covered",
            centralEvidence,
          };
        }
        return {
          abilityId: ability.id,
          text: ability.text,
          signature: [
            ability.kind,
            ...(ability.kind === "static" ? [`static:${ability.staticKind}`] : []),
            ...abilitySignatures(ability),
          ],
          status: "untested",
        };
      }),
    );
    const cardOnlyProven = abilities.length === 0 && markers.cards.has(card.canonicalId);
    if (cardOnlyProven) coveredCardsWithoutAbilities += 1;
    cards.push({
      canonicalId: card.canonicalId,
      slug: card.slug,
      name: faces[0]?.name ?? card.slug,
      sourcePath: source.path,
      testPath: source.testPath,
      cardOnlyStatus: abilities.length === 0 ? (cardOnlyProven ? "proven" : "untested") : null,
      abilities,
    });
  }

  const totalAbilities = cards.reduce((sum, card) => sum + card.abilities.length, 0);
  const report = {
    version: 2,
    generatedAt: "source-derived",
    method: {
      abilities:
        "explicit @covers <abilityId> markers in enabled sibling suites that register runnable tests",
      cardsWithoutAbilities:
        "explicit @covers-card <canonicalId> markers in enabled sibling suites that register runnable tests",
      gaps: "family-keyed scripts/card-coverage/gaps.json",
      centrallyCovered:
        "unconditional parameter-free intrinsic keywords with enabled engine-owned test contracts; card-specific restrictions and effects are not exempt",
    },
    totals: {
      cards: cards.length,
      abilities: totalAbilities,
      provenAbilities,
      centrallyCoveredAbilities,
      coveredAbilities: provenAbilities + centrallyCoveredAbilities,
      cardSpecificAbilities: totalAbilities - centrallyCoveredAbilities,
      blockedAbilities,
      outOfScopeAbilities,
      untestedAbilities:
        totalAbilities -
        provenAbilities -
        centrallyCoveredAbilities -
        blockedAbilities -
        outOfScopeAbilities,
      cardsWithoutAbilities: cards.filter((card) => card.abilities.length === 0).length,
      coveredCardsWithoutAbilities,
    },
    cards,
  };
  if (args.has("--next-cluster")) {
    const gapCluster = selectNextGrandArchiveGapCluster(gaps.families);
    if (gapCluster.families.length > 0) {
      process.stdout.write(`${JSON.stringify({ kind: "gap", ...gapCluster }, null, 2)}\n`);
      return;
    }
    const clusters = new Map<
      string,
      {
        canonicalId: string;
        name: string;
        slug: string;
        abilityId: string;
        abilityText: string;
        sourcePath: string;
        testPath: string;
      }[]
    >();
    for (const card of cards) {
      for (const ability of card.abilities) {
        if (ability.status !== "untested") continue;
        const key = ability.signature.join("|");
        const members = clusters.get(key) ?? [];
        members.push({
          canonicalId: card.canonicalId,
          name: card.name,
          slug: card.slug,
          abilityId: ability.abilityId,
          abilityText: ability.text,
          sourcePath: card.sourcePath,
          testPath: card.testPath,
        });
        clusters.set(key, members);
      }
    }
    const [signature, members] = [...clusters.entries()].sort(
      ([leftSignature, left], [rightSignature, right]) =>
        right.length - left.length || leftSignature.localeCompare(rightSignature),
    )[0] ?? ["", []];
    const signatureParts = signature ? signature.split("|") : [];
    const ruleSections = [
      ...(signatureParts.some((part) => part.startsWith("trigger:"))
        ? ["Abilities / Triggered Abilities"]
        : []),
      ...(signatureParts.includes("effect:rule-modification")
        ? ["Types of Effects / Continuous Effects"]
        : []),
      ...(signatureParts.some((part) => part.startsWith("rule-action:activate"))
        ? ["Playing Cards / Card Activation"]
        : []),
      ...(signatureParts.includes("effect:deal-damage") ? ["Damage"] : []),
      ...(signatureParts.includes("effect:draw") ? ["Drawing Cards"] : []),
      ...(signatureParts.some((part) => part.startsWith("keyword:"))
        ? ["Glossary / Keywords and Abilities"]
        : []),
    ];
    const provenComparables = cards
      .flatMap((card) =>
        card.abilities
          .filter(
            (ability) => ability.status === "proven" && ability.signature.join("|") === signature,
          )
          .map((ability) => ({
            canonicalId: card.canonicalId,
            name: card.name,
            abilityId: ability.abilityId,
            testPath: card.testPath,
          })),
      )
      .slice(0, 5);
    process.stdout.write(
      `${JSON.stringify(
        {
          kind: "untested-behavior",
          signature: signatureParts,
          size: members.length,
          members: members.slice(0, 10),
          remaining: Math.max(0, members.length - 10),
          ruleSections,
          provenComparables,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }
  if (args.has("--write")) {
    await mkdir(dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  if (args.has("--check")) {
    const committed = JSON.parse(await readFile(REPORT_PATH, "utf8")) as unknown;
    if (JSON.stringify(committed) !== JSON.stringify(report)) {
      throw new Error("Card coverage report is stale. Run pnpm run coverage:cards:write.");
    }
  }
  process.stdout.write(`${JSON.stringify(report.totals, null, 2)}\n`);
}

await main();
