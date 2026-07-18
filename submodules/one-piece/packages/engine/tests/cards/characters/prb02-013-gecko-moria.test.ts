import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02GeckoMoria080, prb02GeckoMoria013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-013 Gecko Moria", () => {
  test("with a Thriller Bark Pirates Leader plays a low-cost trash Character rested and gives DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02GeckoMoria080,
      hand: [prb02GeckoMoria013],
      trash: [eb01Doma005],
      activeDon: prb02GeckoMoria013.cost,
      restedDon: 1,
    });
    const domaId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(prb02GeckoMoria013, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Moria's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [domaId] }, "south");

    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(
      true,
    );
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south.restedDon).toBe(6);
    expect(view.prompts).toHaveLength(0);
  });
});
