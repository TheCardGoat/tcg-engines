import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op09Brook073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-073 Brook", () => {
  test("when attacking returns multiple DON!! and gives up to two opposing Characters −2000", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Brook073, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const brookId = engine.findCardInZone("south", "character", op09Brook073);
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const firstPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === firstTargetId)!.power;
    const secondPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === secondTargetId)!.power;
    if (firstPower === null || secondPower === null) {
      throw new Error("Expected both Brook targets to expose power.");
    }
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(brookId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 3 });
    if (payment?.kind !== "payCost") throw new Error("Expected Brook's variable DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(targets).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (targets?.kind !== "selectEntity") throw new Error("Expected Brook's power targets.");
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTargetId,
      secondTargetId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstTargetId, secondTargetId] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe(firstPower - 2000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondTargetId)?.power,
    ).toBe(secondPower - 2000);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe(firstPower);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondTargetId)?.power,
    ).toBe(secondPower);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Brook073, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const brookId = engine.findCardInZone("south", "character", op09Brook073);
    engine.declareAttack(brookId, engine.leader("north"), "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
