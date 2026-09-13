import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import {
  chooseAutomatedAction,
  firstLegalStrategy,
  listLegalCommands,
  valueExtractStrategy,
} from "@tcg/flesh-and-blood-engine/simulator";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { recklessSwingBlue } from "../defense-reactions/reckless-swing.ts";
import { beatenTrackers } from "./beaten-trackers.ts";

describe("Beaten Trackers (DYN006) AAA", () => {
  it("happy: random discard 6+{p} may destroy this and gain 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(wreckerRompRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Rhinar, beatenTrackers).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("choice: player can keep this equipped after the random-discard trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(wreckerRompRed);
    expect(() => game.untilIdle()).toThrow(/requires an explicit answer/);

    const decision = game.pendingDecision();
    expect(decision).toMatchObject({
      kind: "boolean",
      actorId: Rhinar.id,
      acceptLabel: "Destroy this",
      declineLabel: "Don't destroy",
    });

    Rhinar.decline();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Rhinar, beatenTrackers).toBeIn("legs");
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("bot strategy: declines Trackers on the opponent turn because its AP gain is impossible", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [recklessSwingBlue, brutalAssaultRed, wreckerRompRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.endTurn();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defend();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Rhinar);
    Rhinar.play(recklessSwingBlue);
    game.advanceToDecision(Rhinar, "boolean");

    const choice = chooseAutomatedAction(game.getRuntime(), Rhinar.id, valueExtractStrategy);
    expect(choice?.payload.answer).toEqual({ kind: "boolean", value: false });
    Rhinar.decline();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, beatenTrackers).toBeIn("legs");
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("rules boundary: accepting Trackers on the opponent turn does not gain an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [recklessSwingBlue, brutalAssaultRed, wreckerRompRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.endTurn();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defend();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Rhinar);
    Rhinar.play(recklessSwingBlue);
    game.advanceToDecision(Rhinar, "boolean");
    Rhinar.accept();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, beatenTrackers).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("automation: owner setting latches, passes priority, and declines only the optional effect", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    const trackersId = game.findCardInZone(Rhinar.id, "legs", beatenTrackers);
    const beforePriority = game.getPriorityPlayerId();
    const legal = listLegalCommands(game.getRuntime(), Rhinar.id);
    const configuration = legal.find(
      (command) => command.move === "set-optional-trigger-automation",
    );
    expect(configuration).toMatchObject({ automation: "player-only" });
    expect(
      firstLegalStrategy(game.getRuntime(), Rhinar.id, [
        configuration!,
        { move: "pass", payload: {}, label: "Pass" },
      ]),
    ).toMatchObject({ move: "pass" });

    const nonOwner = game.getRuntime().applyCommand(Dash.id, {
      move: "set-optional-trigger-automation",
      instanceId: trackersId,
      mode: "auto-decline",
    });
    expect(nonOwner).toMatchObject({
      success: false,
      errorCode: "ineligible_trigger_automation_source",
    });
    const enabled = game.getRuntime().applyCommand(Rhinar.id, {
      move: "set-optional-trigger-automation",
      instanceId: trackersId,
      mode: "auto-decline",
    });
    expect(enabled).toMatchObject({ success: true });
    if (!enabled.success) throw new Error(enabled.error);
    const automationLog = enabled.moveLogs[0];
    expect(automationLog?.public).toEqual([]);
    expect(automationLog?.privateByPlayerId?.[Rhinar.id]).toContainEqual(
      expect.objectContaining({
        key: "flesh-and-blood.command.set-optional-trigger-automation",
        values: { actorId: Rhinar.id, cardName: "Beaten Trackers" },
        defaultMessage: `${Rhinar.id} changed optional trigger automation for Beaten Trackers.`,
      }),
    );
    expect(automationLog?.privateByPlayerId?.[Dash.id]).toBeUndefined();
    expect(game.getRuntime().snapshot().optionalTriggerAutomation).toEqual({
      [Rhinar.id]: { [trackersId]: "auto-decline" },
    });
    expect(game.getPriorityPlayerId()).toEqual(beforePriority);
    expect(game.getView({ role: "player", actorId: Rhinar.id }).optionalTriggerAutomation).toEqual([
      { sourceInstanceId: trackersId, mode: "auto-decline" },
    ]);
    expect(game.getView({ role: "player", actorId: Dash.id }).optionalTriggerAutomation).toEqual(
      [],
    );
    expect(game.getView({ role: "spectator" }).optionalTriggerAutomation).toEqual([]);

    Rhinar.play(wreckerRompRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectWait(game).notToHaveDecision();
    expectFabCard(Rhinar, beatenTrackers).toBeIn("legs");
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("boundary: p4 random discard does not trigger; Battleworn d1 stays seated", () => {
    const miss = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [beatenTrackers],
        hand: [wreckerRompRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    miss.as(rhinar).play(wreckerRompRed);
    miss.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabCard(miss.as(rhinar), beatenTrackers).toBeIn("legs");

    const bw = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, legs: [beatenTrackers], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = bw.as(rhinar);
    bw.as(bravo).attackWith(snatchRed);
    Rhinar.defendWith(beatenTrackers);
    bw.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, beatenTrackers).toBeIn("legs");
    expectFabCard(Rhinar, beatenTrackers).toHaveDefenseCounters(-1);
    expectFabPlayer(Rhinar).toHaveLife(17);
  });
});
