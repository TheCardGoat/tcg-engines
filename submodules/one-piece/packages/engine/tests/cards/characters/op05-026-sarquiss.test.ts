import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op05Sarquiss026 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-026 Sarquiss", () => {
  test("with DON!! x1, rests a cost-3-or-more Character to set itself active once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op05Sarquiss026, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sarquissId = engine.findCardInZone("south", "character", op05Sarquiss026);
    const lowCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherCostId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const costId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(sarquissId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Sarquiss's Character-rest cost.");
    expect(cost).toMatchObject({ min: 1, max: 1 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([otherCostId, costId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowCostId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sarquissId)?.rested,
    ).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );

    engine.declareAttack(sarquissId, engine.leader("north"), "south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sarquissId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without paying, and without DON!! does not offer the effect", () => {
    const declined = OnePieceTestEngine.create(
      {
        character: [
          { card: op05Sarquiss026, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedId = declined.findCardInZone("south", "character", op05Sarquiss026);
    const costId = declined.findCardInZone("south", "character", eb01MountainGod018);

    declined.declareAttack(declinedId, declined.leader("north"), "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    let view = declined.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === declinedId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);

    const noDon = OnePieceTestEngine.create(
      { character: [{ card: op05Sarquiss026, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const noDonId = noDon.findCardInZone("south", "character", op05Sarquiss026);
    noDon.declareAttack(noDonId, noDon.leader("north"), "south");
    view = noDon.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === noDonId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
