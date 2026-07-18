import { describe, expect, test } from "vite-plus/test";
import {
  op01EustassCaptainKid051,
  op01JeanBart045,
  op01Nekomamushi048,
  op01Shinobu043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('OP01-051 Eustass"Captain"Kid', () => {
  test("rests itself to play a cost-3-or-less Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Shinobu043],
      character: [op01EustassCaptainKid051],
    });
    const kidId = engine.findCardInZone("south", "character", op01EustassCaptainKid051);
    const shinobuId = engine.findCardInZone("south", "hand", op01Shinobu043);

    engine.activateEffect(kidId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Kid's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([shinobuId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [shinobuId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kidId)?.rested).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === shinobuId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("while rested with DON!! attached on the opponent's turn, is the only legal attack target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01EustassCaptainKid051, attachedDon: 1, rested: true, playedOnTurn: 0 },
          { card: op01JeanBart045, rested: true, playedOnTurn: 0 },
        ],
      },
      { character: [{ card: op01Nekomamushi048, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kidId = engine.findCardInZone("south", "character", op01EustassCaptainKid051);
    const otherId = engine.findCardInZone("south", "character", op01JeanBart045);
    const attackerId = engine.findCardInZone("north", "character", op01Nekomamushi048);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId,
        targetId: engine.leader("south"),
      }).accepted,
    ).toBe(false);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId,
        targetId: otherId,
      }).accepted,
    ).toBe(false);

    engine.declareAttack(attackerId, kidId, "north");

    expect(
      engine.getView("north").players.south.characters.some((card) => card?.instanceId === kidId),
    ).toBe(true);
  });

  test("without DON!! attached, does not restrict the opponent's attack target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01EustassCaptainKid051, rested: true, playedOnTurn: 0 }],
      },
      { character: [{ card: op01Nekomamushi048, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op01Nekomamushi048);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
