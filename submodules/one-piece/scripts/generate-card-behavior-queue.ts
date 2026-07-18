import * as cardExports from "../packages/cards/src/index.ts";
import type { OPCard, OPCardType } from "@tcg/op-types";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

type InventoryType = Exclude<OPCardType, "don">;

const inventoryType = process.argv[2] as InventoryType | undefined;
const supportedTypes = new Set<InventoryType>(["leader", "character", "event", "stage"]);

if (!inventoryType || !supportedTypes.has(inventoryType)) {
  throw new Error(
    "Usage: bun scripts/generate-card-behavior-queue.ts <leader|character|event|stage>",
  );
}

function isCard(value: unknown): value is OPCard {
  return Boolean(
    value &&
    typeof value === "object" &&
    "id" in value &&
    "canonicalId" in value &&
    "cardType" in value,
  );
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function hasPrintedEffectText(card: OPCard): boolean {
  const effectText = card.effect?.trim();
  return Boolean(effectText && !/^(?:NULL|-)$/i.test(effectText));
}

function defaultEvidence(card: OPCard): string {
  const structuredTriggers = new Set((card.effects?.effects ?? []).map((block) => block.trigger));
  const triggers: string[] = [...structuredTriggers].map((trigger) => {
    switch (trigger) {
      case "main":
        return "Main";
      case "counter":
        return "Counter";
      case "trigger":
        return "Life Trigger";
      default:
        return trigger;
    }
  });
  if (card.effects?.permanentEffects?.length) {
    triggers.push("permanent");
  }
  if (card.effects?.replacementEffects?.length) {
    triggers.push("replacement");
  }
  if (triggers.length === 0 && card.effects?.keywords?.length) {
    triggers.push(
      ...card.effects.keywords.map((keyword) => keyword[0]!.toUpperCase() + keyword.slice(1)),
    );
  }
  if ("trigger" in card && card.trigger && !structuredTriggers.has("trigger")) {
    triggers.push("Life Trigger (missing executable block)");
  }
  const printedRestDon = card.effect?.match(/You may rest (\d+) of your DON!! cards:/);
  if (printedRestDon?.[1]) {
    const amount = Number(printedRestDon[1]);
    const hasMatchingCost = (card.effects?.effects ?? []).some((block) =>
      (block.costs ?? []).some((cost) => cost.cost === "restDon" && cost.amount === amount),
    );
    if (!hasMatchingCost) {
      triggers.push(`rest ${amount} DON!! cost (missing executable cost)`);
    }
  }
  return triggers.length ? triggers.join(", ") : "Printed behavior is unstructured";
}

const outputPath = new URL(`../docs/card-behavior-${inventoryType}-inventory.md`, import.meta.url);
const existingRows = new Map<string, { status: string; evidence: string; line: string }>();

if (existsSync(outputPath)) {
  for (const line of (await readFile(outputPath, "utf8")).split("\n")) {
    const match = line.match(/^\|\s*([A-Z0-9-]+)\s*\|.*?\|\s*(\w+)\s*\|\s*(.*?)\s*\|$/);
    if (match?.[1] && match[2] && match[3] && match[1] !== "Canonical ID") {
      existingRows.set(match[1], { status: match[2], evidence: match[3], line });
    }
  }
}

const canonicalCards = new Map<string, OPCard>();
for (const card of Object.values(cardExports).filter(isCard)) {
  if (card.cardType === inventoryType && !canonicalCards.has(card.canonicalId)) {
    canonicalCards.set(card.canonicalId, card);
  }
}

const cards = [...canonicalCards.values()].sort((left, right) =>
  left.canonicalId.localeCompare(right.canonicalId),
);
const records = cards.map((card) => {
  const existing = existingRows.get(card.canonicalId);
  const hasStructuredBehavior = Boolean(
    card.effects?.keywords?.length ||
    card.effects?.effects?.length ||
    card.effects?.permanentEffects?.length ||
    card.effects?.replacementEffects?.length,
  );
  const hasPrintedBehavior = Boolean(
    hasPrintedEffectText(card) || ("trigger" in card && card.trigger?.trim()),
  );
  const status =
    existing?.status === "verified"
      ? "verified"
      : hasStructuredBehavior
        ? "pending"
        : hasPrintedBehavior
          ? "gap"
          : "vanilla";
  const evidence =
    existing && existing.status === status && status !== "pending" && status !== "vanilla"
      ? existing.evidence
      : status === "vanilla"
        ? "Parameterized vanilla invariant batch"
        : defaultEvidence(card);
  const existingLine =
    existing?.status === status && existing.evidence === evidence ? existing.line : undefined;
  return { card, status, evidence, existingLine };
});
const rows = records.map(
  ({ card, status, evidence, existingLine }) =>
    existingLine ?? `| ${card.canonicalId} | ${escapeCell(card.name)} | ${status} | ${evidence} |`,
);
const verifiedCount = records.filter(({ status }) => status === "verified").length;
const pendingCount = records.filter(({ status }) => status === "pending").length;
const gapCount = records.filter(({ status }) => status === "gap").length;
const vanillaCount = records.filter(({ status }) => status === "vanilla").length;
const nextRecord = records.find(({ status }) => status === "pending" || status === "gap");

const title = `${inventoryType[0]!.toUpperCase()}${inventoryType.slice(1)}`;
const content = `# One Piece ${title} Behavior Inventory

Generated from the exported card catalog in canonical ID order. Re-running
\`bun scripts/generate-card-behavior-queue.ts ${inventoryType}\` preserves reviewed
verified evidence and unresolved gap notes, refreshes pending timing hints, and
reconciles catalog entries.

| Canonical ID | Card                                            | Status  | Behavior or next evidence                                                |
| ------------ | ----------------------------------------------- | ------- | ------------------------------------------------------------------------ |
${rows.join("\n")}

## Progress

- Canonical ${inventoryType}s: ${cards.length}.
- Verified: ${verifiedCount}.
- Structured pending: ${pendingCount}.
- Printed but unstructured: ${gapCount}.
- Canonical vanilla awaiting the parameterized invariant: ${vanillaCount}.
`;

await writeFile(outputPath, content);

const nextLabel = nextRecord
  ? `${nextRecord.card.canonicalId} ${nextRecord.card.name} (${nextRecord.status})`
  : vanillaCount
    ? `parameterized vanilla invariant (${vanillaCount} cards)`
    : "complete";
console.log(
  `${title} inventory: ${verifiedCount}/${cards.length} verified, ${gapCount} gap(s); next ${nextLabel}`,
);
