import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Cavendish081,
  op04CorridaColiseum096,
  op10Leo057,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-057 Leo", () => {
  test("may rest its Usopp Leader or Stage before searching", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Usopp042,
      hand: [op10Leo057],
      stage: op04CorridaColiseum096,
      deck: [
        op04Cavendish081,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op10Leo057.cost,
    });
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    engine.playCard(op10Leo057, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Leo's Leader-or-Stage cost.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
  });
});
