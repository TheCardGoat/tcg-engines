import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02CharlotteBruleePirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-charlotte-brulee-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST20-003 Charlotte Brulee (Pirate Foil)", () => {
  test("Life Trigger moves the chosen owner's top Life and then returns itself to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [prb02CharlotteBruleePirateFoil003, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bruleeId = engine.findCardInZone("north", "life", prb02CharlotteBruleePirateFoil003);
    const lookedId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const owner = engine.pendingDecision("effectLookAtLifeOwner", "north").steps[0];
    if (owner?.kind !== "chooseOption") throw new Error("Expected Brulee's Life-owner choice.");
    expect(owner.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "self" }, "north");
    const position = engine.pendingDecision("effectLookAtLifePosition", "north").steps[0];
    if (position?.kind !== "chooseOption") throw new Error("Expected the Life placement choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(bruleeId);
    expect(engine.getState().players.north.life.at(-1)).toBe(lookedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may skip looking and still adds the Trigger card to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [prb02CharlotteBruleePirateFoil003, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bruleeId = engine.findCardInZone("north", "life", prb02CharlotteBruleePirateFoil003);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(bruleeId);
    expect(view.prompts).toHaveLength(0);
  });
});
