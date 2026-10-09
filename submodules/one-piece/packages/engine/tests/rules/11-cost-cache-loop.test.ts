import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { observeOptionalLoop } from "../../src/engine/optional-loop.ts";
import { MandatoryLoopDetector } from "../../src/engine/mandatory-loop.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-cost-cache-loop.fixture.ts", import.meta.url));
test.each(["mandatory", "optional"])(
  "derived cost cache does not obscure a %s moving loop",
  (mode) => {
    const output = execFileSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--disable-warning=ExperimentalWarning",
        "--import",
        `data:text/javascript,${encodeURIComponent(register)}`,
        fixture,
        mode,
      ],
      { timeout: 8000, encoding: "utf8", maxBuffer: 1024 * 1024 },
    );
    expect(JSON.parse(output)).toMatchObject({
      status: mode === "mandatory" ? "finished" : "active",
      reason: mode === "mandatory" ? "draw" : null,
      prompts: 0,
      costSources: 2,
      movingSourceContributes: false,
      costs: [3, 3],
    });
  },
  12000,
);

// Rules 11-1-1-1: a real repeated state draws; a changing deck is finite.
// Synthetic native effects deliberately give the moving object its own cache key.
test.each([
  ["own-mandatory", "draw"],
  ["own-finite", "emptyDeck"],
  ["own-choice", null],
])(
  "moving source with its own cost contribution: %s",
  (mode, reason) => {
    const output = execFileSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--disable-warning=ExperimentalWarning",
        "--import",
        `data:text/javascript,${encodeURIComponent(register)}`,
        fixture,
        mode!,
      ],
      { timeout: 8000, encoding: "utf8", maxBuffer: 1024 * 1024 },
    );
    expect(JSON.parse(output)).toMatchObject({
      initialMovingCost: 2,
      initialMovingContribution: true,
      status: mode === "own-choice" ? "active" : "finished",
      reason,
      prompts: 0,
      ...(mode === "own-mandatory"
        ? {
            movingZone: "trash",
            movingSourceContributes: false,
            costSources: 2,
            costs: [3, 3],
          }
        : mode === "own-finite"
          ? { deckCount: 0 }
          : { ordinaryChoice: true, movingZone: "trash" }),
    });
  },
  12000,
);

test("loop comparison retains semantic cost results and pending choices", () => {
  const e = OnePieceTestEngine.create({ character: ["EB01-005"] });
  const source = e.findCardInZone("south", "character", "EB01-005");
  const state = structuredClone(e.getState());
  state.resolutionQueue = [
    {
      id: "proof",
      kind: "effectAction",
      sourceInstanceId: source,
      controller: "south",
      action: {
        action: "rest",
        target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
      },
    },
  ];
  state.continuousCosts = {
    fingerprint: "cache-a",
    contributions: { fixedSource: { [source]: 1 } },
    values: { [source]: 2 },
  };
  const cacheOnly = new MandatoryLoopDetector();
  expect(cacheOnly.repeats(state)).toBe(false);
  state.continuousCosts.fingerprint = "cache-b";
  expect(cacheOnly.repeats(state)).toBe(true);
  const semantic = new MandatoryLoopDetector();
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.values[source] = 3;
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.contributions.fixedSource![source] = 2;
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.powerValues = { [source]: 5000 };
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.powerValues[source] = 6000;
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.powerContributions = { fixedSource: { [source]: 1000 } };
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.powerContributions.fixedSource![source] = 2000;
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.pending = {
    contributions: state.continuousCosts.contributions,
    remaining: ["fixedSource"],
    controller: "south",
    stage: 0,
    roundStart: "{}",
  };
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.pending.powerContributions = { fixedSource: { [source]: 1000 } };
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.pending.powerContributions.fixedSource![source] = 2000;
  expect(semantic.repeats(state)).toBe(false);
  state.continuousCosts.unsupported = true;
  expect(semantic.repeats(state)).toBe(false);
});

// Internal proof-policy control: changing semantic power cannot certify an
// optional repeat even when the redundant invalidation fingerprint is ignored.
test("optional loop evidence retains power values and contributions", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = {
      effects: [
        {
          trigger: "whenBecomesRested",
          optional: true,
          actions: [
            {
              action: "setActive",
              target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create({ character: [card] });
    const source = e.findCardInZone("south", "character", card);
    const state = structuredClone(e.getState());
    state.continuousCosts = {
      fingerprint: "cache-a",
      contributions: {},
      values: {},
      powerValues: { [source]: 5000 },
      powerContributions: { fixed: { [source]: 1000 } },
    };
    const readFingerprint = () => state.optionalLoopEvidence?.[0]?.fingerprint;
    const fingerprint = () => {
      state.optionalLoopEvidence = undefined;
      expect(
        observeOptionalLoop(state, {
          kind: "effectBlock",
          id: "proof",
          sourceInstanceId: source,
          controller: "south",
          trigger: "whenBecomesRested",
          blockIndex: 0,
        }),
      ).toBe("continue");
      const value = readFingerprint();
      expect(value).toBeDefined();
      return value;
    };
    const initial = fingerprint();
    state.continuousCosts.fingerprint = "cache-b";
    expect(fingerprint()).toBe(initial);
    state.continuousCosts.powerValues![source] = 6000;
    const changedValue = fingerprint();
    expect(changedValue).not.toBe(initial);
    state.continuousCosts.powerContributions!.fixed![source] = 2000;
    expect(fingerprint()).not.toBe(changedValue);
  } finally {
    card.effects = saved;
  }
});
