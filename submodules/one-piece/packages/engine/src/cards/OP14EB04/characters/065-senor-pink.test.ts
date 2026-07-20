import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04SenorPink065 } from "../../../../../cards/src/cards/OP14EB04/characters/065-senor-pink.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-065 Senor Pink", () => {
  test("on K.O. makes the opponent choose one physical DON from their field to return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04SenorPink065],
      },
      {
        hand: [op12UrsaShock096],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op12UrsaShock096.cost + 1,
        restedDon: 1,
        donDeckCount: 3,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const senorPinkId = engine.findCardInZone("south", "character", op14eb04SenorPink065);
    const donorId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [senorPinkId] }, "north");

    const returnDon = engine.pendingDecision("effectOpponentReturnDon", "north").steps[0];
    if (returnDon?.kind !== "payCost") throw new Error("Expected Senor Pink's DON!! return.");
    expect(returnDon).toMatchObject({ min: 1, max: 1 });
    const candidateIds = returnDon.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds.some((id) => id.startsWith("active-don:"))).toBe(true);
    expect(candidateIds.some((id) => id.startsWith("rested-don:"))).toBe(true);
    const attachedDonId = candidateIds.find((id) => id.startsWith(`attached-don:${donorId}:`));
    if (!attachedDonId) throw new Error("Expected the DON!! attached to the opponent's Character.");
    engine.resolveDecision("effectOpponentReturnDon", { selectedIds: [attachedDonId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(senorPinkId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === donorId)?.attachedDon,
    ).toBe(0);
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 5, donDeckCount: 4 });
    expect(view.prompts).toHaveLength(0);
  });

  test("with no opposing DON on the field, On K.O. completes without a choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04SenorPink065, rested: true }],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        donDeckCount: 10,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const senorPinkId = engine.findCardInZone("south", "character", op14eb04SenorPink065);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, senorPinkId, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(senorPinkId);
    expect(view.players.north.donDeckCount).toBe(10);
    expect(view.prompts).toHaveLength(0);
  });
});
