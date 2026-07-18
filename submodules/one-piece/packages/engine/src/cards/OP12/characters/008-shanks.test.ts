import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12Shanks008 } from "../../../../../cards/src/cards/OP12/characters/008-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-008 Shanks", () => {
  test("once per turn trashes a hand card on an opponent attack to reduce an opposing card's power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Doma005, eb01Doma005], character: [op12Shanks008] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shanksId = engine.findCardInZone("south", "character", op12Shanks008);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const [firstAttackerId, secondAttackerId] = engine
      .getView("north")
      .players.north.characters.filter((card) => card !== null)
      .map((card) => card.instanceId);

    engine.declareAttack(firstAttackerId!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("north"), firstAttackerId, secondAttackerId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstAttackerId!] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === firstAttackerId)?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 2000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shanks's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shanksId);
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    engine.declareAttack(secondAttackerId!, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(engine.pendingDecision("battleBlocker", "south").steps[0]?.kind).toBe("selectEntity");
  });
});
