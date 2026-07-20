import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13SaintCharlos087 } from "../../../../../cards/src/cards/OP13/characters/087-saint-charlos.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-087 Saint Charlos", () => {
  test("trashes the physical top card of its controller's deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13SaintCharlos087],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op13SaintCharlos087.cost,
    });
    const trashedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op13SaintCharlos087, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as the defender-owned Blocker, retargets the attack, and protects Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Doma005], character: [op13SaintCharlos087] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const charlosId = engine.findCardInZone("south", "character", op13SaintCharlos087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const decision = engine.pendingDecision("battleBlocker", "south");
    expect(decision.actorId).toBe("south");
    const blocker = decision.steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Charlos's Blocker choice.");
    expect(blocker).toMatchObject({ min: 0, max: 1 });
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(charlosId);
    engine.resolveDecision("battleBlocker", { selectedIds: [charlosId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === charlosId)?.rested,
    ).toBe(true);
    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(charlosId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline Blocker and leave the attack on its original target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13SaintCharlos087] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const charlosId = engine.findCardInZone("south", "character", op13SaintCharlos087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(charlosId);
    expect(view.prompts).toHaveLength(0);
  });
});
