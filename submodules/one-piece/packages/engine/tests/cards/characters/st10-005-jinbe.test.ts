import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb02JinbeSt10005PirateFoil005 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

registerCards([prb02JinbeSt10005PirateFoil005]);

describe("ST10-005 Jinbe", () => {
  test("with DON!! x1 reduces an opponent Character's power when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02JinbeSt10005PirateFoil005, attachedDon: 1, playedOnTurn: 0 }],
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", prb02JinbeSt10005PirateFoil005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(jinbeId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
