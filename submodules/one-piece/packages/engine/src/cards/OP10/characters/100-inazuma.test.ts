import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05BeloBetty002 } from "@tcg/op-cards";
import { op10Inazuma100 } from "../../../../../cards/src/cards/OP10/characters/100-inazuma.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-100 Inazuma", () => {
  test("with DON!! rests only within the combined Life cost limit", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Inazuma100, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018], life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inazumaId = engine.findCardInZone("south", "character", op10Inazuma100);
    const lowId = engine.findCardInZone("north", "character", eb01Doma005);
    const highId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(inazumaId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Inazuma's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highId);
  });

  test("Life Trigger plays this card at five combined Life or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op05BeloBetty002, life: [op10Inazuma100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const inazumaId = engine.findCardInZone("north", "life", op10Inazuma100);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(inazumaId);
  });
});
