import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb01KobyJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/characters/014-koby-jolly-roger-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-014 Koby (Jolly Roger Foil)", () => {
  test("blocks only for its controller and moves the selected physical Koby to trash after battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [prb01KobyJollyRogerFoil014],
        hand: [eb01Doma005],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, prb01KobyJollyRogerFoil014],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ownKobyId = engine.findCardInZone("south", "character", prb01KobyJollyRogerFoil014);
    const opposingKobyId = engine.findCardInZone("north", "character", prb01KobyJollyRogerFoil014);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const decision = engine.pendingDecision("battleBlocker", "south");
    expect(decision.actorId).toBe("south");
    const blocker = decision.steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Koby's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ownKobyId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingKobyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [ownKobyId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ownKobyId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingKobyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays its own physical card instead of selecting a card from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [prb01KobyJollyRogerFoil014, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerKobyId = engine.findCardInZone("north", "life", prb01KobyJollyRogerFoil014);
    const unrelatedHandId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerKobyId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(unrelatedHandId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerKobyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its Life Trigger and add that physical card to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [prb01KobyJollyRogerFoil014, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerKobyId = engine.findCardInZone("north", "life", prb01KobyJollyRogerFoil014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(triggerKobyId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      triggerKobyId,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
