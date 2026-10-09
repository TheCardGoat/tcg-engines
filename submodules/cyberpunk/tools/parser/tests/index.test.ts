import { access, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { expect, test } from "vite-plus/test";
import {
  generateEngineTestFiles,
  loadGeneratedCards,
  parsePromoCards,
  parseStructuredCard,
  parseStructuredCards,
} from "../src/index.ts";

const generatedFilePath = resolve(import.meta.dirname, "../../../packages/cards/src/generated.ts");

test("parser reads generated source without rewriting authored cards", async () => {
  const generatedCards = await loadGeneratedCards(generatedFilePath);

  expect(parseStructuredCards(generatedCards).definition).toHaveLength(152);
  expect(parsePromoCards(generatedCards).definition.length).toBeGreaterThan(0);
});

test("parsing face-up Legend counts includes both play areas", async () => {
  const cards = parseStructuredCards(await loadGeneratedCards(generatedFilePath)).definition;
  const legendTarget = {
    selector: "card",
    controller: "friendly",
    zones: ["field", "legendArea"],
    cardTypes: ["legend"],
    face: "faceUp",
  };
  const berserk = cards.find((card) => card.slug === "zetatech-berserk");
  expect(berserk?.costModifier).toMatchObject({
    reducer: "perTargetCount",
    target: legendTarget,
  });
  const panam = cards.find((card) => card.slug === "panam-palmer-strength-through-family");
  expect(panam?.abilities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        trigger: { trigger: "attack" },
        effects: [
          expect.objectContaining({
            effect: "ifYouDo",
            ifEffects: [
              expect.objectContaining({
                effect: "draw",
                amount: { type: "perCount", multiplier: 1, target: legendTarget },
              }),
            ],
          }),
        ],
      }),
    ]),
  );
});

test("a per-Gig static power bonus counts every friendly Gig", async () => {
  const cards = await loadGeneratedCards(generatedFilePath);
  const jackie = cards.find(
    (card) => card.slug === "jackie-welles-ride-or-die-choom" && card.set.code === "alpha",
  );
  expect(jackie).toBeDefined();

  const parsed = parseStructuredCard(jackie!).definition;
  expect(parsed.abilities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        kind: "static",
        effects: [
          expect.objectContaining({
            effect: "modifyPower",
            value: {
              type: "perCount",
              multiplier: 2,
              target: { selector: "gig", controller: "friendly", amount: "all" },
            },
            duration: "continuous",
          }),
        ],
      }),
    ]),
  );
});

test("unsupported text stays visible without an effectless ability", async () => {
  const cards = await loadGeneratedCards(generatedFilePath);
  const source = cards.find(
    (card) =>
      card.slug === "jackie-welles-ride-or-die-choom" &&
      card.set.code === "welcometonightcityretail",
  );
  expect(source).toBeDefined();

  const card = {
    ...source!,
    rulesText: "This Unit can't attack. Unrecognized action text.",
  };
  const parsed = parseStructuredCard(card);
  expect(parsed.definition.abilities).toEqual([
    expect.objectContaining({ kind: "static", text: "This Unit can't attack." }),
  ]);
  expect(parsed.unparsedSegments).toEqual([
    expect.objectContaining({ cardSlug: card.slug, text: "Unrecognized action text." }),
  ]);

  const batch = parseStructuredCards([card]);
  expect(batch.definition).toHaveLength(1);
  expect(batch.unparsedSegments).toEqual(parsed.unparsedSegments);
});

test("engine-test generation rejects partial input before removing existing files", async () => {
  const cards = await loadGeneratedCards(generatedFilePath);
  const promo = cards.find((card) => card.set.code === "promo");
  expect(promo).toBeDefined();

  const outputDir = await mkdtemp(resolve(tmpdir(), "cyberpunk-partial-tests-"));
  const partialFilePath = resolve(outputDir, "partial-cards.ts");
  const sentinel = resolve(outputDir, "existing.test.ts");
  await writeFile(
    partialFilePath,
    `export const cards = ${JSON.stringify([{ ...promo!, rulesText: "Unrecognized action text." }])};`,
  );
  await writeFile(sentinel, "// preserved");

  await expect(
    generateEngineTestFiles({ generatedFilePath: partialFilePath, outputDir }),
  ).rejects.toThrow(/Unrecognized action text/);
  await expect(access(sentinel)).resolves.toBeUndefined();
});

test("engine-test generation clears stale files from its isolated output tree", async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), "cyberpunk-engine-tests-"));
  const sentinel = resolve(outputDir, "units/hand-authored.test.ts");
  await mkdir(resolve(outputDir, "units"), { recursive: true });
  await writeFile(sentinel, "// hand-authored");

  await generateEngineTestFiles({ generatedFilePath, outputDir });

  await expect(access(sentinel)).rejects.toThrow();
});

test("the Spend-a-rival-Unit Play ability matches the authored card — no ready-only filter", async () => {
  // The official FAQ lets "Spend a rival Unit" target already-spent Units;
  // the parser branch used to emit state: "ready", disagreeing with the
  // authored definition on every re-import.
  const cards = await loadGeneratedCards(generatedFilePath);
  const sandayu = cards.find((card) => card.slug === "sandayu-oda-hanako-s-guardian");
  expect(sandayu).toBeDefined();

  const parsed = parseStructuredCard(sandayu!).definition;
  const playAbility = parsed.abilities?.find(
    (ability) =>
      "trigger" in ability &&
      (ability as { trigger?: { trigger?: string } }).trigger?.trigger === "play",
  ) as { effects?: Array<Record<string, unknown>> } | undefined;
  expect(playAbility).toBeDefined();

  const spendEffect = playAbility!.effects?.find(
    (effect) => effect.effect === "forEachFriendlyGigPair",
  ) as { effects?: Array<{ effect?: string; target?: Record<string, unknown> }> } | undefined;
  const spend = spendEffect?.effects?.find((inner) => inner.effect === "spend");
  expect(spend?.target).toBeDefined();
  expect(spend?.target).toMatchObject({
    controller: "rival",
    zones: ["field"],
    cardTypes: ["unit"],
  });
  expect(spend?.target).not.toHaveProperty("state");
});
