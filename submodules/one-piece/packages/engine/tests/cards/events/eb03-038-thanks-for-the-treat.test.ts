import { describe, expect, test } from "vite-plus/test";
import { eb03ThanksForTheTreat038, op06VinsmokeIchiji060, op13Higuma013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { defineAutomaticLeaderCounterTest } from "./automatic-leader-counter.shared.ts";

describe("EB03-038 Thanks for the Treat.", () => {
  test("pays both Main DON!! costs and maps the equal-field all-GERMA add-DON!! count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03ThanksForTheTreat038],
        character: [op06VinsmokeIchiji060],
        activeDon: 2,
      },
      {
        activeDon: 2,
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb03ThanksForTheTreat038);
    const beforePlay = engine.getView("south").players.south;

    engine.playCard(eb03ThanksForTheTreat038);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const donDecision = engine.pendingDecision("effectAddDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the Event controller to receive the optional DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.players.south.donDeckCount).toBe(beforePlay.donDeckCount - 2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays the pre-colon costs but adds no DON!! when either post-colon condition fails", () => {
    const nonGermaEngine = OnePieceTestEngine.create(
      {
        hand: [eb03ThanksForTheTreat038],
        character: [op13Higuma013],
        activeDon: 2,
      },
      {
        activeDon: 2,
      },
    );
    const nonGermaDonDeckBefore = nonGermaEngine.getView("south").players.south.donDeckCount;
    nonGermaEngine.playCard(eb03ThanksForTheTreat038);
    nonGermaEngine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(nonGermaEngine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      donDeckCount: nonGermaDonDeckBefore,
    });
    expect(nonGermaEngine.getView("south").prompts).toHaveLength(0);

    const greaterDonEngine = OnePieceTestEngine.create(
      {
        hand: [eb03ThanksForTheTreat038],
        character: [op06VinsmokeIchiji060],
        activeDon: 3,
      },
      {
        activeDon: 2,
      },
    );
    const greaterDonDeckBefore = greaterDonEngine.getView("south").players.south.donDeckCount;
    greaterDonEngine.playCard(eb03ThanksForTheTreat038);
    greaterDonEngine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const greaterDonView = greaterDonEngine.getView("south");
    expect(greaterDonView.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 2,
      donDeckCount: greaterDonDeckBefore,
    });
    expect(greaterDonView.prompts).toHaveLength(0);
    expect(greaterDonEngine.getState().capabilityHistory).toHaveLength(0);
  });

  defineAutomaticLeaderCounterTest(eb03ThanksForTheTreat038);
});
