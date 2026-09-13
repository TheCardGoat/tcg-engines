import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { serializeFabMatchSnapshot } from "@tcg/flesh-and-blood-engine/runtime";
import { rhinar } from "../heroes/rhinar.ts";
import { rhinarRecklessRampage } from "../heroes/rhinar-reckless-rampage.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { beatenTrackers } from "../equipment/beaten-trackers.ts";
import { snatchRed } from "./snatch.ts";
import { sandSketchedPlanBlue } from "./sand-sketched-plan.ts";

describe("Sand Sketched Plan (WTR009) AAA", () => {
  it("happy: searches a 6+{p} card into hand and discards it", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sandSketchedPlanBlue],
        deck: [brutalAssaultRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(sandSketchedPlanBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: brutalAssaultRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Rhinar, sandSketchedPlanBlue).toBeIn("graveyard");
    expectFabCard(Rhinar, brutalAssaultRed).toBeIn("graveyard");
  });

  it("happy: discarding the searched 6+{p} card grants 2 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sandSketchedPlanBlue],
        deck: [brutalAssaultRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(sandSketchedPlanBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: brutalAssaultRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Rhinar, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(2);
  });

  it("regression: simultaneous discard triggers remain serializable between ordered abilities", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        legs: [beatenTrackers],
        hand: [sandSketchedPlanBlue],
        deck: [brutalAssaultRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinarRecklessRampage);

    Rhinar.play(sandSketchedPlanBlue);
    const search = game.advanceToDecision(Rhinar, "entity-target");
    const searchedId = Rhinar.cardIn("deck", brutalAssaultRed).instanceId;
    const searchedCard = search.candidates.find((candidate) => candidate.instanceId === searchedId);
    if (!searchedCard) throw new Error("Brutal Assault was not a legal Sand Sketched Plan target.");
    const beforeSearchAnswer = game.getState();
    const beforeSearchAnswerSnapshot = serializeFabMatchSnapshot(beforeSearchAnswer);
    game.answerDecision(Rhinar.id, {
      kind: "entity-target",
      instanceIds: [searchedCard.instanceId],
    });
    expect(serializeFabMatchSnapshot(beforeSearchAnswer)).toEqual(beforeSearchAnswerSnapshot);

    const ordering = Rhinar.expectDecision("ordering");
    expect(ordering.entries.map((entry) => entry.label)).toEqual(
      expect.arrayContaining([
        "Rhinar Reckless Rampage: wr9wBtTWwRrPrdhCRHCdN:wheneverDiscard6MorePowerDuringActionPhaseIntimidate",
        "Beaten Trackers: zCWhR7jRCmH7D7fKDGKcF:wheneverDiscardRandom6MoreMayDestroyIfDo",
      ]),
    );
    expectFabPlayer(Rhinar).toHaveAP(2);
    const beforeOrderingAnswer = game.getState();
    const beforeOrderingAnswerSnapshot = serializeFabMatchSnapshot(beforeOrderingAnswer);
    game.answerDecision(Rhinar.id, {
      kind: "ordering",
      orderedIds: ordering.entries.map((entry) => entry.id),
    });
    expect(serializeFabMatchSnapshot(beforeOrderingAnswer)).toEqual(beforeOrderingAnswerSnapshot);

    expect(() => game.getRuntime().snapshot()).not.toThrow();
    expectWait(game).notToHaveDecision();
  });

  it("boundary: discarding a card with fewer than 6{p} does not grant action points", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sandSketchedPlanBlue],
        deck: [
          snatchRed,
          brutalAssaultRed,
          brutalAssaultRed,
          brutalAssaultRed,
          brutalAssaultRed,
          brutalAssaultRed,
        ],
        actionPoints: 1,
      },
      { hero: dash, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(sandSketchedPlanBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Rhinar, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(0);
  });
});
