import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op07Lucy112 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-112 Lucy", () => {
  test("takes top or bottom Life, rests within cost 4, then may replenish at one Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07Lucy112, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lucyId = engine.findCardInZone("south", "character", op07Lucy112);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;
    const deckTopId = engine.getState().players.south.deck[0]!;
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(lucyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(cost?.kind).toBe("chooseOption");
    if (cost?.kind !== "chooseOption") throw new Error("Expected Lucy's Life cost.");
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Lucy's rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Lucy's Life refill.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without moving Life, resting a Character, or changing the deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07Lucy112, playedOnTurn: 0 }],
        life: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lucyId = engine.findCardInZone("south", "character", op07Lucy112);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = [...engine.getState().players.south.life];
    const deckBefore = [...engine.getState().players.south.deck];

    engine.declareAttack(lucyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
  });
});
