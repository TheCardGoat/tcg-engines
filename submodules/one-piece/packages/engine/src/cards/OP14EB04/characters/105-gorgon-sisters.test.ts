import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Marguerite027,
  op07BoaHancock038,
  op07Marguerite054,
  op07Salome043,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04GorgonSisters105 } from "../../../../../cards/src/cards/OP14EB04/characters/105-gorgon-sisters.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-105 Gorgon Sisters", () => {
  test("may reveal three included Amazon Lily or Kuja Pirates cards and give one rested DON to every own field card", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [
        eb03Marguerite027,
        op07Marguerite054,
        op07Salome043,
        op14eb04GorgonSisters105,
        eb01Doma005,
      ],
      character: [op14eb04GorgonSisters105, eb01Doma005],
      restedDon: 3,
    });
    const sourceId = engine.findCardInZone("south", "character", op14eb04GorgonSisters105);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const revealIds = [
      engine.findCardInZone("south", "hand", eb03Marguerite027),
      engine.findCardInZone("south", "hand", op07Salome043),
      engine.findCardInZone("south", "hand", op14eb04GorgonSisters105),
    ];
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (reveal?.kind !== "payCost") throw new Error("Expected Gorgon Sisters' reveal cost.");
    expect(reveal).toMatchObject({ min: 3, max: 3 });
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: revealIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sourceId)?.attachedDon,
    ).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.attachedDon,
    ).toBe(1);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(() => engine.activateEffect(sourceId, "activateMain", "south")).toThrow(
      "This effect has already been used this turn.",
    );
  });

  test("with an included Kuja Pirates Leader its Life Trigger plays itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07BoaHancock038,
        life: [op14eb04GorgonSisters105, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04GorgonSisters105);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(triggerId);
  });
});
