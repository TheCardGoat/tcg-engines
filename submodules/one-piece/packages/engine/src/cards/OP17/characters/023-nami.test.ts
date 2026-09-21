import { describe, expect, test } from "vite-plus/test";
import { op16MonkeyDLuffy095, op17Nami023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP17-023 Nami", () => {
  test("rests itself instead of letting a {Straw Hat Crew} Character be K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op17Nami023 },
          { card: op16MonkeyDLuffy095, rested: true, playedOnTurn: 0 },
        ],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const namiId = engine.findCardInZone("south", "character", op17Nami023);
    const domaId = engine.findCardInZone("south", "character", op16MonkeyDLuffy095);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, domaId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(domaId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(namiId);
    expect(view.players.south.characters.find((c) => c?.instanceId === namiId)?.rested).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op17Nami023 },
          { card: op16MonkeyDLuffy095, rested: true, playedOnTurn: 0 },
        ],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const namiId = engine.findCardInZone("south", "character", op17Nami023);
    const domaId = engine.findCardInZone("south", "character", op16MonkeyDLuffy095);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, domaId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(domaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.south.characters.find((c) => c?.instanceId === namiId)?.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
