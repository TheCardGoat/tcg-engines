import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op11KurozumiOrochi085,
  op11MissSarahebi087,
  op12Mizerka092,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-085 Kurozumi Orochi", () => {
  test("returns only a cost-5-or-less included SMILE card from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11KurozumiOrochi085],
      trash: [op11MissSarahebi087, op12Mizerka092, eb01Doma005],
      activeDon: op11KurozumiOrochi085.cost,
    });
    const eligibleId = engine.findCardInZone("south", "trash", op11MissSarahebi087);
    const expensiveId = engine.findCardInZone("south", "trash", op12Mizerka092);

    engine.playCard(op11KurozumiOrochi085, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Orochi's SMILE choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
  });
});
