import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";

describe("Command and Conquer (ARC159) AAA", () => {
  it("happy: hitting a hero destroys every card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(commandAndConquerRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: a fully defended attack does not destroy arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(commandAndConquerRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: defense reaction cards cannot be played this chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Attacker = game.as(dash, 1);
    const Defender = game.as(dash, 2);

    Attacker.attackWith(commandAndConquerRed);
    game.advanceCombatTo("reaction");
    Attacker.pass();
    const instanceId = Defender.findCardInZone("hand", sinkBelowRed);
    expect(
      Defender.expectFailure({
        move: "begin-play",
        payload: { instanceId },
      }).errorCode,
    ).toBe("defense_reactions_blocked");
  });
});
