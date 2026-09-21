import { describe, expect, test } from "vite-plus/test";
import {
  op09Hongo011,
  op15Purinpurin031,
  op16MonkeyDLuffy095,
  op16Rockstar018,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP16-018 Rockstar", () => {
  test("replaces a {Red-Haired Pirates} K.O. by trashing a Character with 6000 or more power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        character: [
          { card: op16Rockstar018 },
          { card: op09Hongo011, rested: true, playedOnTurn: 0 },
        ],
        hand: ["OP16-096", "OP16-039"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const hongoId = engine.findCardInZone("south", "character", op09Hongo011);
    const bigId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    // Yamato (8000) would K.O. Hongo (3000, {Red-Haired Pirates}).
    engine.declareAttack(attackerId, hongoId, "north");
    // The OP16-080 fixture Leader's own [On Your Opponent's Attack] window
    // resolves first; decline it, pass the Counter step, then the K.O.
    // replacement offers the 8000-power Character from hand.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("battleKoReplacement", { selectedIds: [bigId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(hongoId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bigId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger for a non-{Red-Haired Pirates} victim", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        character: [
          { card: op16Rockstar018 },
          { card: op16MonkeyDLuffy095, rested: true, playedOnTurn: 0 },
        ],
        hand: ["OP16-096"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const luffyVictimId = engine.findCardInZone("south", "character", op16MonkeyDLuffy095);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, luffyVictimId, "north");
    // Teach's own window needs a Trigger card in hand; with none it never
    // opens. Pass the Counter step and let the K.O. resolve unreplaced.
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      luffyVictimId,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});

describe("OP15-031 Purinpurin", () => {
  test("K.O.s a rested Character whose cost equals its given DON!! count", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Purinpurin031], activeDon: op15Purinpurin031.cost },
      {
        character: [
          { cardId: "OP16-095", rested: true, attachedDon: 2 },
          { cardId: "OP13-013", rested: true, attachedDon: 2 },
          { cardId: "OP16-096", rested: true, attachedDon: 2 },
        ],
      },
    );
    const luffyId = engine.findCardInZone("north", "character", "OP16-095");

    engine.playCard(op15Purinpurin031, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    const candidates = ko.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(luffyId);
    expect(candidates).not.toContain(engine.findCardInZone("north", "character", "OP13-013"));
    expect(candidates).not.toContain(engine.findCardInZone("north", "character", "OP16-096"));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(luffyId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });
});
