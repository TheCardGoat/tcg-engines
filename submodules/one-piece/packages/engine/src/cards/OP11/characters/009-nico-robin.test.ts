import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11NicoRobin009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-009 Nico Robin", () => {
  test("with DON!! x2 reduces an opposing Character through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11NicoRobin009, attachedDon: 2, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const robinId = engine.findCardInZone("south", "character", op11NicoRobin009);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(robinId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(1000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(1000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(3000);
  });
});
