import { describe, expect, test } from "vite-plus/test";
import {
  op13Higuma013,
  op13StEthanbaronVNusjuro080,
  op13StShepherdJuPeter084,
  op13TheEmptyThrone099,
  op13TheWorldSEquilibriumCannotBeMaintainedForever097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-099 The Empty Throne", () => {
  test("powers its Leader on its turn and pays both rest costs before playing an affordable Five Elders Character", () => {
    const engine = OnePieceTestEngine.create({
      stage: op13TheEmptyThrone099,
      hand: [
        op13StEthanbaronVNusjuro080,
        op13StShepherdJuPeter084,
        op13TheWorldSEquilibriumCannotBeMaintainedForever097,
      ],
      trash: Array.from({ length: 19 }, () => op13Higuma013),
      activeDon: 6,
    });
    const stageId = engine.findCardInZone("south", "stage", op13TheEmptyThrone099);
    const eligibleId = engine.findCardInZone("south", "hand", op13StEthanbaronVNusjuro080);
    const tooExpensiveId = engine.findCardInZone("south", "hand", op13StShepherdJuPeter084);
    const wrongCategoryId = engine.findCardInZone(
      "south",
      "hand",
      op13TheWorldSEquilibriumCannotBeMaintainedForever097,
    );

    expect(engine.getView("south").players.south.leader.power).toBe(6000);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playDecision.actorId).toBe("south");
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected The Empty Throne to publish its Character play choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCategoryId);
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 3,
      restedDon: 3,
    });
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);

    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId),
    ).toMatchObject({ cardId: op13StEthanbaronVNusjuro080.id, rested: false });

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
