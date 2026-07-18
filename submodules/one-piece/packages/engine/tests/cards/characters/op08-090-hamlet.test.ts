import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Dobon080, op08Hamlet090 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-090 Hamlet", () => {
  test("on play may play an included SMILE Character costing 2 or less from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Hamlet090],
      activeDon: op08Hamlet090.cost,
      trash: [op02Dobon080, eb01Fourtricks025, eb01Doma005],
    });
    const eligibleId = engine.findCardInZone("south", "trash", op02Dobon080);
    const expensiveId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op08Hamlet090, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Hamlet's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
