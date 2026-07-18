import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01OffWhite019,
  op01XDrake054,
  op14eb04CaponeGangBege003,
  op14eb04Urouge002,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const ownKoEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OWN-KO",
  canonicalId: "TEST-OWN-KO",
  name: "Own K.O. Review",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([ownKoEvent]);

describe('OP14-003 Capone"Gang"Bege', () => {
  test("only blocks opposing low-power Character effect K.O.", () => {
    const protectedEngine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Urouge002, attachedDon: 3, playedOnTurn: 0 }] },
      { character: [op14eb04CaponeGangBege003] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const urougeId = protectedEngine.findCardInZone("south", "character", op14eb04Urouge002);
    const protectedBegeId = protectedEngine.findCardInZone(
      "north",
      "character",
      op14eb04CaponeGangBege003,
    );
    protectedEngine.declareAttack(urougeId, protectedEngine.leader("north"));
    const protectedTarget = protectedEngine.pendingDecision("effectTargetSelection", "south")
      .steps[0];
    expect(protectedTarget).toMatchObject({ kind: "selectEntity", min: 0, max: 0 });
    if (protectedTarget?.kind !== "selectEntity") {
      throw new Error("Expected Urouge's filtered K.O. target choice.");
    }
    expect(protectedTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedBegeId,
    );
    expect(protectedTarget.candidates).toHaveLength(0);
    protectedEngine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(protectedEngine.getView("south").prompts).toHaveLength(0);
    expect(protectedEngine.findCardInZone("north", "character", op14eb04CaponeGangBege003)).toBe(
      protectedBegeId,
    );

    const highPowerEngine = OnePieceTestEngine.create(
      { hand: [op01XDrake054], activeDon: op01XDrake054.cost },
      { character: [{ card: op14eb04CaponeGangBege003, rested: true }] },
    );
    const highPowerBegeId = highPowerEngine.findCardInZone(
      "north",
      "character",
      op14eb04CaponeGangBege003,
    );
    highPowerEngine.playCard(op01XDrake054);
    highPowerEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [highPowerBegeId] },
      "south",
    );
    expect(highPowerEngine.findCardInZone("north", "trash", op14eb04CaponeGangBege003)).toBe(
      highPowerBegeId,
    );

    const ownEffectEngine = OnePieceTestEngine.create({
      hand: [ownKoEvent],
      character: [op14eb04CaponeGangBege003],
    });
    const ownBegeId = ownEffectEngine.findCardInZone(
      "south",
      "character",
      op14eb04CaponeGangBege003,
    );
    ownEffectEngine.playCard(ownKoEvent);
    ownEffectEngine.resolveDecision("effectTargetSelection", { selectedIds: [ownBegeId] }, "south");
    expect(ownEffectEngine.findCardInZone("south", "trash", op14eb04CaponeGangBege003)).toBe(
      ownBegeId,
    );
  });
});
