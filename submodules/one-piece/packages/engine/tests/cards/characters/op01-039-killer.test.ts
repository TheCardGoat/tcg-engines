import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Killer039 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-039 Killer", () => {
  test("with DON!! attached and three Characters, draws when selected as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Killer039, attachedDon: 1, playedOnTurn: 0 },
          eb01Doma005,
          eb01Doma005,
        ],
        deck: [eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const killerId = engine.findCardInZone("south", "character", op01Killer039);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [killerId] }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore + 1);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      killerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
