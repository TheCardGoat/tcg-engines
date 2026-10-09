import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb03Hibari008, op11Hibari010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-008 Hibari", () => {
  test("maps her On Play SWORD recipient, active-Character attack, and once-per-turn reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Hibari008],
        character: [
          { card: op11Hibari010, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
        activeDon: 3,
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const recipientId = engine.findCardInZone("south", "character", op11Hibari010);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb03Hibari008, "south");
    const hibariId = engine.findCardInZone("south", "character", eb03Hibari008);
    const attackRecipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(attackRecipient?.kind).toBe("selectEntity");
    if (attackRecipient?.kind !== "selectEntity") {
      throw new Error("Expected Hibari's SWORD attack recipient.");
    }
    expect(attackRecipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      recipientId,
      hibariId,
    ]);
    expect(attackRecipient.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      wrongTraitId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    engine.activateEffect(hibariId, "activateMain", "south");
    const reduction = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(reduction?.kind).toBe("selectEntity");
    if (reduction?.kind !== "selectEntity") {
      throw new Error("Expected Hibari's opposing power target.");
    }
    expect(reduction.candidates.map((candidate) => candidate.ref.id)).toEqual([opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(2000);
    engine.declareAttack(recipientId, opposingId, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      opposingId,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: hibariId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the same SWORD active-attack permission from When Attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb03Hibari008, playedOnTurn: 0 },
          { card: op11Hibari010, playedOnTurn: 0 },
        ],
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hibariId = engine.findCardInZone("south", "character", eb03Hibari008);
    const recipientId = engine.findCardInZone("south", "character", op11Hibari010);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(hibariId, engine.leader("north"), "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Hibari's When Attacking SWORD recipient.");
    }
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    engine.declareAttack(recipientId, activeTargetId, "south");
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      activeTargetId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: Koby lets the just-played Hibari target herself and attack an active Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-001", hand: ["EB03-008"], activeDon: 3 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("EB03-008");
    const hibari = e.findCardInZone("south", "character", "EB03-008");
    e.asSouth().chooseTargets(hibari);
    e.asSouth().attack(hibari, target);
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
