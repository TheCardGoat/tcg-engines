import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Buggy051, op09Cabaji045, op09Mohji053 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-045 Cabaji", () => {
  test.each([
    ["Buggy", op09Buggy051],
    ["Mohji", op09Mohji053],
  ])("cannot be K.O.'d in battle while a %s Character is present", (_name, companion) => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op09Cabaji045, rested: true }, companion] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const cabajiId = engine.findCardInZone("north", "character", op09Cabaji045);

    engine.declareAttack(attackerId, cabajiId, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(cabajiId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(cabajiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is K.O.'d in battle without either named Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op09Cabaji045, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const cabajiId = engine.findCardInZone("north", "character", op09Cabaji045);

    engine.declareAttack(attackerId, cabajiId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      cabajiId,
    );
  });
});
