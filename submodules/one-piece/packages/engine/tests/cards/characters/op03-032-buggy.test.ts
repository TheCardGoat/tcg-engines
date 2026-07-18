import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op03Buggy032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-032 Buggy", () => {
  test("survives battle against Slash but can be K.O.'d by another attribute", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Buggy032, rested: true }] },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const buggyId = engine.findCardInZone("south", "character", op03Buggy032);
    const slashId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const strikeId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(slashId, buggyId, "north");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === buggyId),
    ).toBe(true);
    expect(
      engine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).not.toContain(buggyId);

    engine.declareAttack(strikeId, buggyId, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      buggyId,
    );
  });
});
