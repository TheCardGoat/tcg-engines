import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Concasser059, op12Sanji041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-041 Sanji", () => {
  test("only offers Events with Main, including a Main/Counter Event, across saved selection", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: ["OP03-072", op12Concasser059],
      deck: ["EB01-025", "EB01-025"],
      activeDon: 1,
    });
    const counter = engine.findCardInZone("south", "hand", "OP03-072");
    const main = engine.findCardInZone("south", "hand", op12Concasser059);
    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().acceptOptional();
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Event choice");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([main]);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: decision.id,
      selectedIds: [counter],
    });
    expect(engine.pendingDecision("effectTargetSelection", "south").id).toBe(decision.id);
    expect(engine.findCardInZone("south", "hand", "OP03-072")).toBe(counter);
    engine.asSouth().chooseTargets(main);
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(main);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(counter);
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0, donDeckCount: 11 });
    expect(view.prompts).toHaveLength(0);
  });

  test("can pay and choose no Event when the hand has only Counter and Trigger effects", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: ["OP03-072"],
      activeDon: 1,
    });
    const counter = engine.findCardInZone("south", "hand", "OP03-072");
    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().acceptOptional();
    const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected empty Event choice");
    expect(step.candidates).toHaveLength(0);
    engine.asSouth().chooseTargets();
    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([counter]);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0, donDeckCount: 11 });
  });

  test("returns DON to activate a qualifying Event for free, then replenishes rested DON when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Sanji041,
        hand: [op12Concasser059],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("south", "hand", op12Concasser059);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0, donDeckCount: 11 });

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 10 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test.each([true, false])(
    "free Event activation can pay or decline Lightning cost: pay=%s",
    (pay) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: op12Sanji041, hand: ["OP09-077"], activeDon: 3 },
        { character: [eb01Doma005] },
      );
      const event = engine.findCardInZone("south", "hand", "OP09-077");
      const target = engine.findCardInZone("north", "character", eb01Doma005);
      engine.activateEffect(engine.leader("south"), "activateMain", "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [event] }, "south");
      engine.resolveDecision("effectOptional", { optionId: pay ? "yes" : "no" }, "south");
      if (pay) engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      const view = engine.getView("south");
      expect(view.players.south).toMatchObject({
        activeDon: pay ? 0 : 2,
        restedDon: 0,
        donDeckCount: pay ? 13 : 11,
      });
      expect(view.players.south.trash.map((card) => card.instanceId)).toContain(event);
      expect(view.players.north.trash.some((card) => card.instanceId === target)).toBe(pay);
    },
  );

  test("does not add DON on attack when its field has more DON than the opponent", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12Sanji041, activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: 10,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
