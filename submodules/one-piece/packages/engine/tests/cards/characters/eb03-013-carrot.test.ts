import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb03Carrot013, op08Zou039 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-013 Carrot", () => {
  test("on its play turn K.O.s only an eligible rested Character, then plays Zou", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Carrot013, op08Zou039],
        activeDon: 6,
      },
      {
        character: [
          { card: eb01MountainGod018, rested: true },
          { card: eb03Carrot013, rested: true },
          eb01Doma005,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb03Carrot013);
    const activeId = engine.findCardInZone("north", "character", eb01Doma005);
    const zouId = engine.findCardInZone("south", "hand", op08Zou039);

    engine.playCard(eb03Carrot013, "south");
    const carrotId = engine.findCardInZone("south", "character", eb03Carrot013);
    engine.activateEffect(carrotId, "activateMain", "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Carrot's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Carrot's Zou play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([zouId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [zouId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.stage?.instanceId).toBe(zouId);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: carrotId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: declining KO still permits playing Zou", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB03-013", "OP08-039"], activeDon: 6 },
      { character: [{ cardId: "EB01-005", rested: true }] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005"),
      zou = e.findCardInZone("south", "hand", "OP08-039");
    e.asSouth().play("EB03-013");
    e.asSouth().activateMain(e.findCardInZone("south", "character", "EB03-013"));
    e.asSouth().chooseTargets();
    e.resolveDecision("effectPlaySelection", { selectedIds: [zou] }, "south");
    expect(e.getView("south").players.south.stage?.instanceId).toBe(zou);
    expect(e.findCardInZone("north", "character", "EB01-005")).toBe(target);
  });
  test("an older Character cannot activate even with both printed targets available", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "EB03-013", playedOnTurn: 0 }], hand: ["OP08-039"] },
      { character: [{ cardId: "EB01-005", rested: true }] },
    );
    const f = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "EB03-013"),
      trigger: "activateMain",
    });
    const after = OnePieceTestEngine.fromState(f.state).getView("south");
    expect(after.players.south.handCount).toBe(1);
    expect(after.players.north.characters.filter(Boolean)).toHaveLength(1);
  });
});
