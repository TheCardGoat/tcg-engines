import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05Sakazuki041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-041 Sakazuki", () => {
  test("trashes to draw, then reduces an opposing Character's cost when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op05Sakazuki041,
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(engine.getView("south").players.south.hand[0]?.cardId).toBe(eb01Fourtricks025.id);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(2);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
