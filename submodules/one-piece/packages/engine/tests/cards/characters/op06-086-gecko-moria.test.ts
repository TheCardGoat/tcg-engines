import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, op06GeckoMoria086 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const drawOnPlay: CharacterCard = {
  ...eb01Fourtricks025,
  id: "TEST-OP06-086-DRAW",
  canonicalId: "TEST-OP06-086-DRAW",
  name: "Test Moria Draw",
  cost: 4,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

const returnOnPlay: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP06-086-RETURN",
  canonicalId: "TEST-OP06-086-RETURN",
  name: "Test Moria Return",
  cost: 2,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
        ],
      },
    ],
  },
};

registerCards([drawOnPlay, returnOnPlay]);

function createMoriaEngine(trash: CharacterCard[]) {
  return OnePieceTestEngine.create({
    hand: [op06GeckoMoria086],
    activeDon: op06GeckoMoria086.cost,
    trash,
  });
}

function chooseReadySource(engine: OnePieceTestEngine, sourceId: string) {
  const step = engine.pendingDecision("readyEffectOrder", "south").steps[0];
  if (step?.kind !== "chooseOption") throw new Error("Expected ready On Play effect choice");
  const option = step.options.find((candidate) => candidate.targetId === sourceId);
  if (!option) throw new Error("Expected the selected On Play source");
  engine.resolveDecision("readyEffectOrder", { optionId: option.id }, "south");
}

describe("OP06-086 Gecko Moria", () => {
  test.each([3, 4])(
    "plays both selected Characters starting with %s Characters before On Play order",
    (fieldCount) => {
      const engine = OnePieceTestEngine.create(
        {
          hand: [op06GeckoMoria086],
          activeDon: 8,
          character: Array.from({ length: fieldCount }, () => eb01Fourtricks025),
          trash: ["OP02-096", "OP01-006"],
        },
        { character: [eb01Fourtricks025] },
      );
      const fillers = engine
        .getView("south")
        .players.south.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));
      const kuzanId = engine.findCardInZone("south", "trash", "OP02-096");
      const otamaId = engine.findCardInZone("south", "trash", "OP01-006");
      const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
      const deckBefore = engine.getView("south").players.south.deckCount;

      engine.asSouth().play(op06GeckoMoria086);
      engine.resolveDecision(
        "effectGroupedPlaySelection",
        { selectedIds: [kuzanId, otamaId] },
        "south",
      );
      engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: kuzanId }, "south");
      const replacement = engine.pendingDecision("effectPlayCharacterReplacement", "south")
        .steps[0];
      expect(replacement).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
      for (let index = 0; index < fieldCount - 2; index += 1) {
        engine.resolveDecision(
          "effectPlayCharacterReplacement",
          { selectedIds: [fillers[index]!] },
          "south",
        );
        expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
      }
      const characters = engine.getView("south").players.south.characters;
      expect(characters.filter(Boolean)).toHaveLength(5);
      expect(characters.find((card) => card?.instanceId === kuzanId)?.rested).toBe(false);
      expect(characters.find((card) => card?.instanceId === otamaId)?.rested).toBe(true);
      chooseReadySource(engine, otamaId);
      expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
      engine.asSouth().chooseTargets(opposingId);
      expect(
        engine
          .getView("south")
          .players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
      ).toBe(3000);
      expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("chooses zero or one eligible card, and a single card enters active", () => {
    const declined = createMoriaEngine([eb01Doma005]);
    declined.playCard(op06GeckoMoria086, "south");
    declined.resolveDecision("effectGroupedPlaySelection", { selectedIds: [] }, "south");
    expect(declined.getView("south").prompts).toHaveLength(0);
    expect(declined.getView("south").players.south.trash).toHaveLength(1);

    const engine = createMoriaEngine([eb01Doma005]);
    const selectedId = engine.findCardInZone("south", "trash", eb01Doma005);
    engine.playCard(op06GeckoMoria086, "south");
    const play = engine.pendingDecision("effectGroupedPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Moria's grouped play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: [selectedId] }, "south");

    const played = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === selectedId);
    expect(played?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("requires one selected card to satisfy each group and lets the player assign active/rested", () => {
    const engine = createMoriaEngine([drawOnPlay, eb01Fourtricks025, returnOnPlay]);
    const costFourId = engine.findCardInZone("south", "trash", drawOnPlay);
    const costThreeId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const costTwoId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");

    const decision = engine.pendingDecision("effectGroupedPlaySelection", "south");
    expect(
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: decision.id,
        selectedIds: [costFourId, costThreeId],
      }).accepted,
    ).toBe(false);
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [costFourId, costTwoId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: costTwoId }, "south");

    const characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === costTwoId)?.rested).toBe(false);
    expect(characters.find((card) => card?.instanceId === costFourId)?.rested).toBe(true);
    const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw new Error("Expected ready On Play choice");
    expect(order.options).toHaveLength(2);
    expect(new Set(order.options.map((option) => option.targetId))).toEqual(
      new Set([costFourId, costTwoId]),
    );
  });

  test("activates the played cards' On Play effects in the chosen order", () => {
    const engine = createMoriaEngine([drawOnPlay, returnOnPlay]);
    const drawId = engine.findCardInZone("south", "trash", drawOnPlay);
    const returnId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [drawId, returnId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: drawId }, "south");
    const handBefore = engine.getView("south").players.south.hand.length;
    chooseReadySource(engine, drawId);

    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore + 1);
    expect(engine.pendingDecision("effectTargetSelection", "south").steps[0]?.kind).toBe(
      "selectEntity",
    );
  });

  test("cancels a pending On Play when that played card leaves the field", () => {
    const engine = createMoriaEngine([drawOnPlay, returnOnPlay]);
    const drawId = engine.findCardInZone("south", "trash", drawOnPlay);
    const returnId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [drawId, returnId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: drawId }, "south");
    const deckBefore = engine.getView("south").players.south.deckCount;
    chooseReadySource(engine, returnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawId] }, "south");

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("trashing the first grouped play for the second does not activate the departed card's On Play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GeckoMoria086],
        activeDon: 8,
        character: [eb01Fourtricks025, eb01Fourtricks025, eb01Fourtricks025],
        trash: ["OP02-096", "OP01-006"],
      },
      { character: [eb01Fourtricks025] },
    );
    const kuzan = engine.asSouth().findInZone("trash", "OP02-096");
    const otama = engine.asSouth().findInZone("trash", "OP01-006");
    const target = engine.asNorth().findOnField(eb01Fourtricks025);
    const deckBefore = engine.asSouth().view().players.south.deckCount;

    engine.asSouth().play(op06GeckoMoria086);
    engine.asSouth().choose("effectGroupedPlaySelection", [kuzan, otama]);
    engine.asSouth().chooseOption("effectGroupedPlayStateAssignment", kuzan);
    engine.asSouth().choose("effectPlayCharacterReplacement", [kuzan]);
    // Only Otama remains eligible, so there is no On Play ordering decision.
    engine.asSouth().chooseTargets(target);

    expect(engine.asSouth().view().players.north.characters[0]?.power).toBe(3000);
    expect(engine.asSouth().view().players.south.deckCount).toBe(deckBefore);
    expect(engine.asSouth().findInZone("trash", "OP02-096")).toBe(kuzan);
    expect(engine.asSouth().findOnField("OP01-006")).toBe(otama);
    expect(engine.asSouth().view().prompts).toHaveLength(0);
  });
});
