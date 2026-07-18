import { describe, expect, test } from "vite-plus/test";
import { op13Inazuma005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-005 Inazuma", () => {
  test("on play gives up to one rested DON!! to its Leader", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Inazuma005],
      activeDon: op13Inazuma005.cost,
      restedDon: 1,
    });

    engine.playCard(op13Inazuma005, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
  });
});
