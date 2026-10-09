import { describe, expect, test } from "vite-plus/test";
import { op16MonkeyDLuffy095, op17Nami023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP17-023 Nami", () => {
  test("FAQ: rests itself once to protect itself and an Straw Hat Character from simultaneous KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-016"], activeDon: 3 },
      { character: ["OP17-023", "ST01-006"] },
    );
    const nami = e.findCardInZone("north", "character", "OP17-023"),
      higuma = e.findCardInZone("north", "character", "ST01-006");
    e.playCard("OP17-016");
    e.resolveDecision("effectTargetSelection", { selectedIds: [nami, higuma] }, "south");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    const v = e.getView("north");
    expect(v.players.north.characters.filter(Boolean).map((c) => c?.instanceId)).toEqual([
      nami,
      higuma,
    ]);
    expect(v.players.north.characters.find((c) => c?.instanceId === nami)?.rested).toBe(true);
    expect(v.players.north.trash).toHaveLength(0);
    expect(v.prompts).toHaveLength(0);
  });

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
