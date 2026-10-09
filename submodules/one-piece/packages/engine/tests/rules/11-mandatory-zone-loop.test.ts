import type { Action, EffectBlock } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const selfKo: Action = {
  action: "ko",
  target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
};
const replay: Action = {
  action: "play",
  source: { player: "self", zone: "trash" },
  count: { amount: 1 },
  self: true,
};

// No catalog infinite loop is claimed. These synthetic printed effects exercise
// public play/choice/turn commands and restore the catalog after every case.
function withLoop(blocks: EffectBlock[], run: (card: ReturnType<typeof getCard>) => void) {
  const card = getCard("EB01-005");
  const original = card.effects;
  try {
    card.effects = { effects: blocks };
    run(card);
  } finally {
    card.effects = original;
  }
}

function expectStopped(engine: OnePieceTestEngine) {
  expect(engine.getView("south").prompts).toHaveLength(0);
  expect(engine.getView("north").prompts).toHaveLength(0);
  expect(engine.getState()).toMatchObject({
    resolutionQueue: [],
    resolutionStatus: "idle",
    battle: null,
  });
  expect(engine.getState().pendingAutoEffects).toBeUndefined();
  expect(engine.getState().readyEffectGroup).toBeUndefined();
  expect(engine.getState().effectResolving).toBeUndefined();
}

describe("11-1 compulsory self-K.O. and replay", () => {
  test("an unavoidable moving cycle ends as a draw", () =>
    withLoop(
      [
        { trigger: "onPlay", actions: [selfKo] },
        { trigger: "onKo", actions: [replay] },
      ],
      (card) => {
        const engine = OnePieceTestEngine.create({ hand: [card], activeDon: 3 });
        engine.playCard(card, "south");
        expect(engine.getView("south")).toMatchObject({
          status: "finished",
          finishReason: "draw",
          winner: null,
        });
        expectStopped(engine);
      },
    ));

  test("finite draws end in deck defeat before the remaining K.O. can resolve", () =>
    withLoop(
      [
        { trigger: "onPlay", actions: [{ action: "draw", player: "self", amount: 1 }, selfKo] },
        { trigger: "onKo", actions: [replay] },
      ],
      (card) => {
        const engine = OnePieceTestEngine.create({
          hand: [card],
          activeDon: 3,
          deck: ["EB01-025", "EB01-018"],
        });
        const source = engine.findCardInZone("south", "hand", card);
        engine.playCard(card, "south");
        const view = engine.getView("south");
        expect(view).toMatchObject({
          status: "finished",
          finishReason: "emptyDeck",
          winner: "north",
        });
        expect(view.players.south.deckCount).toBe(0);
        expect(view.players.south.hand).toHaveLength(2);
        expect(view.players.south.characters.some((c) => c?.instanceId === source)).toBe(true);
        expect(view.players.south.trash).toHaveLength(0);
        expectStopped(engine);
        const finished = engine.getState();
        engine.expectFailure({ type: "endTurn", seat: "south" });
        expect(engine.getState()).toEqual(finished);
      },
    ));

  test("optional replay remains a stopping choice, including after snapshot restore", () =>
    withLoop(
      [
        { trigger: "onPlay", actions: [selfKo] },
        { trigger: "onKo", optional: true, actions: [replay] },
      ],
      (card) => {
        let engine = OnePieceTestEngine.create({ hand: [card], activeDon: 3 });
        engine.playCard(card, "south");
        expect(engine.getView("south").status).toBe("active");
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
        expect(engine.getView("south").status).toBe("active");
        engine.exec({
          type: "resolvePrompt",
          seat: "south",
          promptId: engine.pendingDecision("loopIterations", "south").id,
          iterations: 0,
        });
        expect(engine.getView("south").finishReason).toBe(null);
        expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain(card.id);
        expectStopped(engine);
      },
    ));

  test("a replay target choice is not an unavoidable loop", () =>
    withLoop(
      [
        { trigger: "onPlay", actions: [selfKo] },
        {
          trigger: "onKo",
          actions: [
            { action: "play", source: { player: "self", zone: "trash" }, count: { amount: 1 } },
          ],
        },
      ],
      (card) => {
        const engine = OnePieceTestEngine.create({
          hand: [card],
          activeDon: 3,
          trash: ["EB01-025"],
        });
        engine.playCard(card, "south");
        const other = engine.findCardInZone("south", "trash", "EB01-025");
        expect(engine.pendingDecision("effectPlaySelection", "south")).toBeDefined();
        expect(engine.getView("south").finishReason).toBe(null);
        engine.resolveDecision("effectPlaySelection", { selectedIds: [other] }, "south");
        expect(engine.getView("south").status).toBe("active");
        expect(
          engine.getView("south").players.south.characters.some((c) => c?.instanceId === other),
        ).toBe(true);
      },
    ));

  test("old On Play generations are discarded; new generations still offer their own ordering choice", () =>
    withLoop(
      [
        { trigger: "onPlay", actions: [selfKo] },
        { trigger: "onPlay", actions: [{ action: "draw", player: "self", amount: 1 }] },
        { trigger: "onKo", actions: [replay] },
      ],
      (card) => {
        let engine = OnePieceTestEngine.create({
          hand: [card],
          activeDon: 3,
          deck: ["EB01-025", "EB01-018"],
        });
        engine.playCard(card, "south");
        const choose = (effect: number) => {
          const step = engine.pendingDecision("readyEffectOrder", "south").steps[0];
          if (step.kind !== "chooseOption") throw new Error("Expected ready-effect order.");
          const option = step.options.find((o) => o.label.endsWith(`effect ${effect}`));
          if (!option) throw new Error("Missing synthetic effect.");
          engine.resolveDecision("readyEffectOrder", { optionId: option.id }, "south");
        };
        choose(1);
        // The old source's draw must not survive its K.O./replay. A fresh source
        // generation now has both effects ready, requiring another player choice.
        expect(engine.getView("south").players.south.hand).toHaveLength(0);
        expect(engine.getView("south").players.south.deckCount).toBe(2);
        expect(engine.getView("south").finishReason).toBe(null);
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        choose(2);
        expect(engine.getView("south").players.south.hand).toHaveLength(1);
        expect(engine.getView("south").players.south.deckCount).toBe(1);
        expect(engine.pendingDecision("readyEffectOrder", "south")).toBeDefined();
        expect(engine.getView("south").finishReason).toBe(null);
      },
    ));
});
