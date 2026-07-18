import { describe, expect, test } from "vite-plus/test";
import { op13CurlyDadan009, op13Higuma013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-009 Curly.Dadan", () => {
  test("gains Double Attack only while another Mountain Bandits Character is present", () => {
    const withAlly = OnePieceTestEngine.create(
      {
        character: [{ card: op13CurlyDadan009, attachedDon: 3, playedOnTurn: 0 }, op13Higuma013],
      },
      { life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    withAlly.declareAttack(
      withAlly.findCardInZone("south", "character", op13CurlyDadan009),
      withAlly.leader("north"),
      "south",
    );
    expect(withAlly.getView("south").players.north.lifeCount).toBe(0);

    const alone = OnePieceTestEngine.create(
      { character: [{ card: op13CurlyDadan009, attachedDon: 3, playedOnTurn: 0 }] },
      { life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    alone.declareAttack(
      alone.findCardInZone("south", "character", op13CurlyDadan009),
      alone.leader("north"),
      "south",
    );
    expect(alone.getView("south").players.north.lifeCount).toBe(1);
  });
});
