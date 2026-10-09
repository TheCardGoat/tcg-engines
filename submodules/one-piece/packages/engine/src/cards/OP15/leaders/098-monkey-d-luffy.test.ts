import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15MonkeyDLuffy098 } from "../../../../../cards/src/cards/leaders/op15-098-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-098 Monkey.D.Luffy", () => {
  test("replaces an opponent's battle K.O. with the top Life card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15MonkeyDLuffy098,
        character: [{ cardId: "OP15-107", rested: true }],
        life: ["EB01-005", "EB01-025"],
      },
      { character: [{ cardId: "OP16-096", playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const chopper = engine.findCardInZone("south", "character", "OP15-107");
    engine.declareAttack(engine.findCardInZone("north", "character", "OP16-096"), chopper, "north");
    engine.pendingDecision("battleKoReplacement", "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === chopper)).toBe(true);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.hand.map((card) => card.cardId)).toContain("EB01-005");
    expect(view.prompts).toHaveLength(0);
  });

  test.each(["south", "north"] as const)(
    "only replaces opponent non-K.O. removal: %s acts",
    (actor) => {
      const event = { hand: ["OP14-058"], activeDon: 6 };
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op15MonkeyDLuffy098,
          character: ["OP15-107"],
          life: 2,
          ...(actor === "south" ? event : {}),
        },
        actor === "north" ? event : {},
        { activeSeat: actor },
      );
      const chopper = engine.findCardInZone("south", "character", "OP15-107");
      engine.playCard("OP14-058", actor);
      engine.acceptLeadingOptional(actor);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [chopper] }, actor);
      if (actor === "north") {
        engine.pendingDecision("effectRemovalReplacement", "south");
        engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
      }
      const view = engine.getView("south");
      expect(view.players.south.characters.some((card) => card?.instanceId === chopper)).toBe(
        actor === "north",
      );
      expect(view.players.south.hand.some((card) => card.instanceId === chopper)).toBe(
        actor === "south",
      );
      expect(view.players.south.lifeCount).toBe(actor === "north" ? 1 : 2);
      expect(view.prompts).toHaveLength(0);
    },
  );
  test("keeps a 6000+ base power Sky Island Character on the field by paying 1 Life when removed", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15MonkeyDLuffy098, character: [op15Enel060], activeDon: 7 },
      {
        hand: [eb01ConquererOfThreeWorldsRagnaraku039, eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const enelId = engine.findCardInZone("south", "character", op15Enel060);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(enelId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, "north");

    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === enelId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).not.toContain(enelId);
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("removes a Character without the Sky Island trait normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15MonkeyDLuffy098, character: [eb01Fourtricks025], activeDon: 7 },
      {
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const fourtricksId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fourtricksId] }, "north");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(fourtricksId);
    expect(south.characters.some((card) => card?.instanceId === fourtricksId)).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("one top Life card replaces a simultaneous K.O. of two eligible Characters (FAQ)", () => {
    let engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15MonkeyDLuffy098,
        character: ["OP15-107", op15Enel060],
        life: ["EB01-005", "EB01-025"],
      },
      { leaderCardId: "OP01-061", hand: ["OP01-094"], activeDon: 10 },
      { activeSeat: "north" },
    );
    engine.asNorth().play("OP01-094");
    engine.asNorth().acceptOptional();
    // All DON is rested after paying Kaido, so the uniform return cost auto-pays.
    expect(engine.getView("north").players.north.restedDon).toBe(4);
    engine.pendingDecision("effectKoReplacement", "south");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const south = engine.getView("south").players.south;
    expect(south.characters.filter(Boolean)).toHaveLength(2);
    expect(south.lifeCount).toBe(1);
    expect(south.hand.map((card) => card.cardId)).toEqual(["EB01-005"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([0, 1])(
    "battle removal with %i Life: unavailable payment or explicit decline permits K.O.",
    (life) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op15MonkeyDLuffy098,
          character: [{ cardId: "OP15-107", rested: true }],
          life,
        },
        { character: [{ cardId: "OP16-096", playedOnTurn: 0 }], hand: [] },
        { activeSeat: "north" },
      );
      const target = engine.findCardInZone("south", "character", "OP15-107");
      engine.asNorth().attack(engine.findCardInZone("north", "character", "OP16-096"), target);
      if (life) engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");
      expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
        target,
      );
      expect(engine.getView("south").players.south.lifeCount).toBe(life);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});
