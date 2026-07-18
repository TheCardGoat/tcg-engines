import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op08CharlotteCustard103 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-103 Charlotte Custard", () => {
  test("takes top Life to give a Character +1000 through the opponent's next turn once", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08CharlotteCustard103],
      life: [eb01Fourtricks025, eb01Doma005],
      character: [eb01Doma005],
      activeDon: op08CharlotteCustard103.cost,
    });
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const lifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.playCard(op08CharlotteCustard103, "south");
    const custardId = engine.findCardInZone("south", "character", op08CharlotteCustard103);
    engine.activateEffect(custardId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      4000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: custardId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(4000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
  });
});
