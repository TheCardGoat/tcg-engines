import { describe, expect, test } from "vite-plus/test";
import { op01Kawamatsu037, op04MonkeyDLuffy014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-014 Monkey.D.Luffy", () => {
  test("Banish trashes damaged Life without activating its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04MonkeyDLuffy014, playedOnTurn: 0 }],
      },
      {
        life: [op01Kawamatsu037],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op04MonkeyDLuffy014);
    const lifeId = engine.findCardInZone("north", "life", op01Kawamatsu037);

    engine.declareAttack(luffyId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.characters.some((card) => card?.instanceId === lifeId)).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
