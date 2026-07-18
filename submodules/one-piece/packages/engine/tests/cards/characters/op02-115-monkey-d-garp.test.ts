import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, op02MonkeyDGarp115, op02Saldeath074, op02Sengoku103 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const ownZeroCostCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP02-115-OWN-ZERO-COST",
  canonicalId: "TEST-OP02-115-OWN-ZERO-COST",
  name: "Own Zero-Cost Character",
  cost: 0,
};

registerCards([ownZeroCostCharacter]);

describe("OP02-115 Monkey.D.Garp", () => {
  test("with two attached DON!! may K.O. only an opposing cost-0 Character when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02MonkeyDGarp115, playedOnTurn: 0 },
          { card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 },
        ],
        activeDon: 2,
      },
      { character: [op02Saldeath074, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const garpId = engine.findCardInZone("south", "character", op02MonkeyDGarp115);
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const eligibleId = engine.findCardInZone("north", "character", op02Saldeath074);
    const excludedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    engine.attachDon(garpId, 2, "south");
    engine.declareAttack(garpId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Garp's cost-0 K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with fewer than two attached DON!! does not offer the K.O. effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02MonkeyDGarp115, playedOnTurn: 0 },
          { card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 },
        ],
        activeDon: 1,
      },
      {
        character: [op02Saldeath074],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const garpId = engine.findCardInZone("south", "character", op02MonkeyDGarp115);
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.attachDon(garpId, 1, "south");
    engine.declareAttack(garpId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(targetId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with two attached DON!! may choose no cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02MonkeyDGarp115, playedOnTurn: 0 },
          { card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 },
          ownZeroCostCharacter,
        ],
        activeDon: 2,
      },
      { character: [op02Saldeath074] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const garpId = engine.findCardInZone("south", "character", op02MonkeyDGarp115);
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const ownCostZeroId = engine.findCardInZone("south", "character", ownZeroCostCharacter);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.attachDon(garpId, 2, "south");
    engine.declareAttack(garpId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Garp's cost-0 K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostZeroId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === targetId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
