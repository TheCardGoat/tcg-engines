import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Usopp024,
  op11MonkeyDLuffy040,
  op12BoeufBurst060,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-060 Boeuf Burst", () => {
  test("Main's first choice returns the opposing cost-4 Character to owner hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11MonkeyDLuffy040,
        hand: [op12BoeufBurst060],
        activeDon: 3,
      },
      { character: [op09Usopp024, eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", op09Usopp024);

    engine.playCard(op12BoeufBurst060);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Main's second choice draws two at the post-payment six-hand-or-less boundary", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11MonkeyDLuffy040,
      hand: [op12BoeufBurst060, ...Array(5).fill(eb01MountainGod018)],
      deck: [eb01Doma005, op09Usopp024],
      activeDon: 3,
    });
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.playCard(op12BoeufBurst060);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
