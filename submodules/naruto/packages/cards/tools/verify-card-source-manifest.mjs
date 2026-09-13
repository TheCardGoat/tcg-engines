import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const manifestUrl = new URL("../card-source-manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
const outputUrl = new URL(`../${manifest.output.path}`, import.meta.url);
const source = await readFile(outputUrl, "utf8");
const actualHash = createHash("sha256").update(source).digest("hex");
const actualIds = [...source.matchAll(/^ {4}id: "([^"]+)",$/gm)].map((match) => match[1]);
const communitySnapshotUrl = new URL(
  `../${manifest.communitySnapshot?.path ?? "missing"}`,
  import.meta.url,
);
const communitySnapshotSource = await readFile(communitySnapshotUrl, "utf8").catch(() => "");
const communitySnapshot = communitySnapshotSource ? JSON.parse(communitySnapshotSource) : null;
const actualCommunitySnapshotHash = createHash("sha256")
  .update(communitySnapshotSource)
  .digest("hex");
const simulatorCommunitySource = communitySnapshot?.sources?.narutoCardGameSimulator;
const exBurstCommunitySource = communitySnapshot?.sources?.exBurst;
const runtimeCards = (await import(new URL("../src/cards.ts", import.meta.url))).CARDS;
const reviewedSource = manifest.provenance?.find(
  (entry) => entry.status === "primary-source-reviewed",
);
const simulatorProvenance = manifest.provenance?.find(
  (entry) =>
    entry.status === "community-source-scraped" && entry.source === "naruto-card-game-simulator",
);
const exBurstProvenance = manifest.provenance?.find(
  (entry) => entry.status === "community-source-scraped" && entry.source === "exburst",
);

const expectedConfirmedClaims = new Map([
  ["totalDeckSize", 51],
  ["chakraCount", 5],
  ["summonCount", 1],
  ["cardTypes", ["leader", "character", "ex_character", "chakra", "summon"]],
  ["charactersChosenByLeaderColor", true],
  ["exCharactersRequireConditions", true],
  ["summonRestsToDeploy", true],
  ["chakraActivatesFaceDownSupports", true],
  ["leaderLifeZeroLoses", true],
]);

function fail(message) {
  process.stderr.write(`Card-source manifest verification failed: ${message}\n`);
  process.exitCode = 1;
}

function payloadHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function runtimeSourceDifferences() {
  const sourceCards = simulatorCommunitySource?.cards ?? [];
  const sourceById = new Map(sourceCards.map((card) => [card.id, card]));
  const differences = [];
  for (const card of runtimeCards) {
    const sourceCard = sourceById.get(card.id);
    if (!sourceCard) {
      differences.push({ cardId: card.id, field: "$card", outputValue: card, sourceValue: null });
      continue;
    }
    for (const field of new Set([...Object.keys(card), ...Object.keys(sourceCard)])) {
      if (JSON.stringify(card[field]) !== JSON.stringify(sourceCard[field])) {
        differences.push({
          cardId: card.id,
          field,
          outputValue: card[field] ?? null,
          sourceValue: sourceCard[field] ?? null,
        });
      }
    }
  }
  return differences;
}

if (manifest.schemaVersion !== 3) {
  fail("schemaVersion must be 3");
} else if (!reviewedSource) {
  fail("provenance must include a primary-source-reviewed entry");
} else if (reviewedSource.url !== "https://www.naruto-cardgame.com/en/welcome/") {
  fail("reviewed source must be the official English welcome page");
} else if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedSource.accessedOn ?? "")) {
  fail("reviewed source accessedOn must be an ISO date");
} else if (!/^[a-f0-9]{64}$/.test(reviewedSource.retrieval?.contentSha256 ?? "")) {
  fail("reviewed source retrieval.contentSha256 must be a SHA-256 digest");
} else if (
  reviewedSource.retrieval?.hashInput !==
  "normalized visible text from the #type and #feature sections, in that order"
) {
  fail("reviewed source must define the normalized content representation");
} else if (!Array.isArray(reviewedSource.claimEvidence)) {
  fail("reviewed source claimEvidence must be an array");
} else if (
  new Set(reviewedSource.claimEvidence.map((claim) => claim.field)).size !==
  reviewedSource.claimEvidence.length
) {
  fail("reviewed source claimEvidence contains duplicate fields");
} else if (
  JSON.stringify(reviewedSource.claimEvidence.map((claim) => claim.field).sort()) !==
  JSON.stringify([...expectedConfirmedClaims.keys()].sort())
) {
  fail("reviewed source claimEvidence must map every confirmed structural field exactly once");
} else if (
  reviewedSource.claimEvidence.some(
    (claim) =>
      JSON.stringify(claim.value) !== JSON.stringify(expectedConfirmedClaims.get(claim.field)),
  )
) {
  fail("reviewed source claimEvidence contains a value that differs from the reviewed page");
} else if (
  reviewedSource.claimEvidence.some(
    (claim) =>
      !["#type", "#feature"].includes(claim.anchor) ||
      typeof claim.support !== "string" ||
      claim.support.length === 0,
  )
) {
  fail("every confirmed structural field needs a supported official-page anchor");
} else if (
  !reviewedSource.claimEvidence.find((claim) => claim.field === "totalDeckSize")?.limitation
) {
  fail("the 51-card statement must retain its composition limitation");
} else if (
  !reviewedSource.provisionalInterpretations?.some(
    (interpretation) => interpretation.field === "mainDeckSize" && interpretation.value === 50,
  )
) {
  fail("the 50-card Preview main deck must be recorded as a provisional interpretation");
} else if (!simulatorProvenance || !exBurstProvenance) {
  fail("provenance must record both community card sources");
} else if (
  simulatorProvenance.url !== "https://narutocardgamesimulator.com/en/collection" ||
  exBurstProvenance.url !== "https://exburst.dev/naruto/cardlist"
) {
  fail("community provenance URLs must use the reviewed public catalog routes");
} else if (!communitySnapshot || communitySnapshot.schemaVersion !== 1) {
  fail("community card snapshot must use schemaVersion 1");
} else if (communitySnapshot.status !== "provisional-community-cross-check") {
  fail("community card snapshot must retain its provisional status");
} else if (manifest.communitySnapshot.sha256 !== actualCommunitySnapshotHash) {
  fail("communitySnapshot.sha256 does not match the checked-in snapshot");
} else if (
  simulatorCommunitySource?.sourceUrl !== "https://narutocardgamesimulator.com/en/collection" ||
  exBurstCommunitySource?.sourceUrl !== "https://exburst.dev/naruto/cardlist"
) {
  fail("checked-in snapshot source URLs do not match the reviewed public catalog routes");
} else if (
  simulatorProvenance.retrieval?.payloadUrl !== simulatorCommunitySource.payloadUrl ||
  simulatorProvenance.retrieval?.payloadSha256 !== simulatorCommunitySource.sha256 ||
  simulatorProvenance.retrieval?.cardCount !== simulatorCommunitySource.cards.length ||
  exBurstProvenance.retrieval?.payloadSha256 !== exBurstCommunitySource.sha256 ||
  exBurstProvenance.retrieval?.cardCount !== exBurstCommunitySource.cards.length
) {
  fail("manifest retrieval metadata does not match the checked-in community snapshot");
} else if (
  simulatorCommunitySource?.sha256 !== payloadHash(simulatorCommunitySource?.cards ?? null) ||
  exBurstCommunitySource?.sha256 !== payloadHash(exBurstCommunitySource?.cards ?? null)
) {
  fail("a community-source payload hash does not match its checked-in cards");
} else if (
  simulatorCommunitySource.cards.length !==
    manifest.communitySnapshot.sourceCardCounts.narutoCardGameSimulator ||
  exBurstCommunitySource.cards.length !== manifest.communitySnapshot.sourceCardCounts.exBurst
) {
  fail("community source counts do not match the manifest");
} else if (
  JSON.stringify(runtimeCards.map((card) => card.id)) !==
  JSON.stringify(simulatorCommunitySource.cards.map((card) => card.id))
) {
  fail("runtime card ids and order do not match the primary community snapshot");
} else if (
  communitySnapshot.reconciliation.exactNumberMatches +
    communitySnapshot.reconciliation.inferredIdentityMatches.length +
    communitySnapshot.reconciliation.simulatorOnly.length !==
  simulatorCommunitySource.cards.length
) {
  fail("reconciliation does not account for every Naruto Card Game Simulator card");
} else if (
  communitySnapshot.reconciliation.exactNumberMatches +
    communitySnapshot.reconciliation.inferredIdentityMatches.length +
    communitySnapshot.reconciliation.exBurstOnly.length !==
  exBurstCommunitySource.cards.length
) {
  fail("reconciliation does not account for every ExBurst card");
} else if (
  JSON.stringify(runtimeSourceDifferences()) !==
  JSON.stringify(manifest.communitySnapshot.reviewedOverrides ?? [])
) {
  fail("runtime cards differ from the reviewed community source outside recorded overrides");
} else if (!Array.isArray(manifest.output.cardIds)) {
  fail("output.cardIds must be an array");
} else if (new Set(manifest.output.cardIds).size !== manifest.output.cardIds.length) {
  fail("output.cardIds contains duplicates");
} else if (manifest.output.cardCount !== manifest.output.cardIds.length) {
  fail("output.cardCount does not equal output.cardIds length");
} else if (manifest.output.cardCount !== actualIds.length) {
  fail(`expected ${manifest.output.cardCount} cards but found ${actualIds.length}`);
} else if (JSON.stringify(manifest.output.cardIds) !== JSON.stringify(actualIds)) {
  fail("output.cardIds does not match src/cards.ts in order");
} else if (manifest.output.sha256 !== actualHash) {
  fail("output.sha256 does not match src/cards.ts");
} else {
  process.stdout.write(
    `Verified ${actualIds.length} provisional card definitions against two community catalogs and card-source-manifest.json.\n`,
  );
}
