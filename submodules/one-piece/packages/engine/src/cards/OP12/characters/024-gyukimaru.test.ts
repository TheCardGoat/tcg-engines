import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op08BurnBlade117 } from "@tcg/op-cards";
import { op12Gyukimaru024 } from "../../../../../cards/src/cards/OP12/characters/024-gyukimaru.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function createKoEngine(rested: boolean) {
  return OnePieceTestEngine.create(
    { character: [{ card: op12Gyukimaru024, rested }, eb01Doma005] },
    { hand: [op08BurnBlade117], life: [eb01Doma005], activeDon: op08BurnBlade117.cost },
    { firstPlayer: "south", activeSeat: "north" },
  );
}

describe("OP12-024 Gyukimaru", () => {
  test("while active cannot be K.O.'d by an opponent's effect", () => {
    const engine = createKoEngine(false);
    const protectedId = engine.findCardInZone("south", "character", op12Gyukimaru024);
    const legalId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Burn Blade's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(legalId);
  });

  test("while rested can be K.O.'d by an opponent's effect", () => {
    const engine = createKoEngine(true);
    const gyukimaruId = engine.findCardInZone("south", "character", op12Gyukimaru024);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [gyukimaruId] }, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      gyukimaruId,
    );
  });

  test("with three total given DON!! rests only an eligible Character when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op12Gyukimaru024, playedOnTurn: 0 },
          { card: eb01Doma005, attachedDon: 3 },
        ],
      },
      { character: [eb01Doma005, op01Shanks120] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const gyukimaruId = engine.findCardInZone("south", "character", op12Gyukimaru024);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(gyukimaruId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Gyukimaru's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });
});
