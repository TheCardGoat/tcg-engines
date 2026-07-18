import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Iceburg032,
  op03GalleyLaCompany075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-032 Iceburg", () => {
  test("at three DON!! searches and plays Galley-La Company from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Iceburg032],
      deck: [
        op03GalleyLaCompany075,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 3,
    });
    const stageId = engine.findCardInZone("south", "deck", op03GalleyLaCompany075);

    engine.playCard(eb02Iceburg032, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      restedDon: 1,
    });
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Iceburg's top-seven search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === stageId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [stageId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Iceburg's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Iceburg's Stage play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([stageId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [stageId] }, "south");

    expect(engine.getView("south").players.south.stage?.instanceId).toBe(stageId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not search or play after its cost leaves only two DON!! on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Iceburg032, op03GalleyLaCompany075],
      activeDon: 2,
    });
    const stageId = engine.findCardInZone("south", "hand", op03GalleyLaCompany075);

    engine.playCard(eb02Iceburg032, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      stage: null,
    });
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      stageId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
