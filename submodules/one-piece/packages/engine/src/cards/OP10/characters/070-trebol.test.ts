import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01OffWhite019,
  op10CloneSoldier064,
  op10Sugar065,
  op10Trebol070,
} from "@tcg/op-cards";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const koCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-070-KO",
  canonicalId: "TEST-OP10-070-KO",
  name: "Trebol Effect K.O. Test",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};
registerCards([koCharacter]);

describe("OP10-070 Trebol", () => {
  test("protects current base-power-1000 allies from opponent effect K.O. through their next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10Trebol070],
        character: [op10Sugar065, eb01Doma005],
        activeDon: 4,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        hand: [koCharacter, koCharacter, koCharacter],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("south", "character", op10Sugar065);
    const unprotectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op10Trebol070, "south");
    engine.endTurn("south");

    engine.playCard(koCharacter, "north");
    const protectedChoice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(protectedChoice?.kind).toBe("selectEntity");
    if (protectedChoice?.kind !== "selectEntity") throw new Error("Expected a K.O. choice.");
    expect(protectedChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(protectedId);

    engine.playCard(koCharacter, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [unprotectedId] }, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      unprotectedId,
    );

    engine.endTurn("north");
    engine.endTurn("south");
    engine.playCard(koCharacter, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      protectedId,
    );
  });

  test("may block an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Trebol070] },
      { character: [{ card: op10CloneSoldier064, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const trebolId = engine.findCardInZone("south", "character", op10Trebol070);
    const attackerId = engine.findCardInZone("north", "character", op10CloneSoldier064);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [trebolId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === trebolId)?.rested,
    ).toBe(true);
  });
});
