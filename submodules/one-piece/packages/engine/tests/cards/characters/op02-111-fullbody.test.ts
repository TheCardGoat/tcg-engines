import { describe, expect, test } from "vite-plus/test";
import { op01Pacifista075, op02Fullbody111, op02Jango100, op02Saldeath074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-111 Fullbody", () => {
  test("with Jango gains +3000 only during its battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Fullbody111, playedOnTurn: 0 },
          { card: op02Jango100, playedOnTurn: 0 },
        ],
      },
      { character: [op01Pacifista075, { card: op02Saldeath074, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fullbodyId = engine.findCardInZone("south", "character", op02Fullbody111);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(fullbodyId, targetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === fullbodyId)?.power,
    ).toBe(6000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === fullbodyId)?.power,
    ).toBe(3000);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("with only an opposing Jango receives no battle power bonus", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Fullbody111, playedOnTurn: 0 }] },
      {
        character: [op01Pacifista075, op02Jango100, { card: op02Saldeath074, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fullbodyId = engine.findCardInZone("south", "character", op02Fullbody111);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(fullbodyId, targetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === fullbodyId)?.power,
    ).toBe(3000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
