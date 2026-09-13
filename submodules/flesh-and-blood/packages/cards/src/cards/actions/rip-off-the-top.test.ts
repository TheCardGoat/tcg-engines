import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { alphaInstinctBlue } from "./alpha-instinct.ts";
import { dash } from "../heroes/dash.ts";
import { rok } from "../weapons/rok.ts";
import { hulkUpBlue } from "./hulk-up.ts";
import { windUpTheCrowdBlue } from "./wind-up-the-crowd.ts";
import { songOfSinewYellow } from "./song-of-sinew.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { rompingClub } from "../weapons/romping-club.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { ripOffTheTopYellow } from "./rip-off-the-top.ts";

describe("Rip Off the Top (PEN008) AAA", () => {
  it("play line: Song, Rip, Tuffnut, and Rok combine for a 14{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        weapon1: [rok],
        hand: [songOfSinewYellow, ripOffTheTopYellow, wreckerRompBlue],
        deck: [alphaInstinctBlue, windUpTheCrowdBlue, hulkUpBlue, wreckerRompBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(songOfSinewYellow);
    const reorder = game.advanceToDecision(Tuffnut, "partition");
    game.answerDecision(Tuffnut.id, {
      kind: "partition",
      groups: { top: reorder.entries.map((entry) => entry.id) },
    });
    game.helpers.resolveUntilIdle();
    game.helpers.expectLog("flesh-and-blood.next-attack-power-bonus", {
      sourceName: "Song Of Sinew",
      amount: 4,
    });
    game.helpers.expectPrivateLog("flesh-and-blood.opt.private", Tuffnut.id, {
      topNames: "Alpha Instinct, Wind Up The Crowd, Hulk Up, Wrecker Romp",
      bottomNames: "nothing",
    });

    Tuffnut.play(ripOffTheTopYellow, { pitch: [wreckerRompBlue] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Tuffnut).toHaveResourceCount(5);
    expect(Tuffnut.zone("hand")).toHaveLength(0);
    game.helpers.expectPrivateLog("flesh-and-blood.draw.private", Tuffnut.id, {
      cardNames: "Alpha Instinct",
    });
    for (const cardName of ["Wrecker Romp", "Alpha Instinct"]) {
      game.helpers.expectLog("flesh-and-blood.pitch", {
        playerId: Tuffnut.id,
        cardName,
        resources: 3,
      });
    }
    game.helpers.expectLog("flesh-and-blood.next-attack-power-bonus", {
      sourceName: "Rip Off The Top",
      amount: 3,
    });

    Tuffnut.activate(tuffnut);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Tuffnut).toHaveResourceCount(8).toHaveTokenCount("toughness", 1);
    game.helpers.expectLog("flesh-and-blood.pitch", {
      playerId: Tuffnut.id,
      cardName: "Wind Up The Crowd",
      resources: 3,
    });
    game.helpers.expectLog("flesh-and-blood.crowd-cheers", { playerId: Tuffnut.id });
    game.helpers.expectLog("flesh-and-blood.create", {
      playerId: Tuffnut.id,
      cardName: "Toughness",
    });

    Tuffnut.activate(rok);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(14);
    game.helpers.expectLog("flesh-and-blood.modify-power", {
      cardName: "Rok",
      to: 14,
    });
  });

  it("interaction: Song and Rip combine on an attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        weapon1: [rok],
        hand: [songOfSinewYellow, ripOffTheTopYellow, wreckerRompBlue, brutalAssaultBlue],
        deck: [alphaInstinctBlue, windUpTheCrowdBlue, hulkUpBlue, wreckerRompBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(songOfSinewYellow);
    const reorder = game.advanceToDecision(Tuffnut, "partition");
    game.answerDecision(Tuffnut.id, {
      kind: "partition",
      groups: { top: reorder.entries.map((entry) => entry.id) },
    });
    game.helpers.resolveUntilIdle();

    Tuffnut.play(ripOffTheTopYellow, { pitch: [wreckerRompBlue] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Tuffnut, brutalAssaultBlue).toBeIn("hand");

    Tuffnut.activate(tuffnut);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Tuffnut.attackWith(brutalAssaultBlue);

    // Printed 4 + Song's 4 reveals + Rip's 3.
    expectCombat(game).toHaveAttackPower(11);
  });

  it("happy: pitching a random 6+{p} card gives the next attack +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [ripOffTheTopYellow],
        arsenal: [snatchRed],
        deck: [wreckerRompBlue],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(ripOffTheTopYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Tuffnut, wreckerRompBlue).toBeIn("pitch");
    expectFabPlayer(Tuffnut).toHaveResourceCount(3);

    Tuffnut.attackWith(snatchRed, { from: "arsenal" });
    // Snatch 4 + 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: pitching a card with less than 6{p} does not buff the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        weapon1: [rompingClub],
        hand: [ripOffTheTopYellow],
        deck: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(ripOffTheTopYellow);
    game.helpers.resolveUntilIdle();
    Tuffnut.activate(rompingClub);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [ripOffTheTopYellow],
        deck: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(ripOffTheTopYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Tuffnut).toHaveAP(1);
  });
});
