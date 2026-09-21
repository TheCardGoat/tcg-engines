import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed, hyperDriverYellow } from "../actions/hyper-driver.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltRed, flashBoltYellow } from "../instants/flash-bolt.ts";
import { mbrioBaseVizier } from "./mbrio-base-vizier.ts";

const padding = () => Array.from({ length: 6 }, () => nimblismBlue);
const steamPreventionOption = "ifWouldBeDealtArcaneDamageMayRemoveSteam";

describe("mBrio Base Vizier (PEN058) AAA", () => {
  for (const mode of ["accept", "decline"] as const) {
    it(`${mode}: each arcane event independently offers steam prevention`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          life: 20,
          hand: [hyperDriverRed],
          head: [mbrioBaseVizier],
          resourcePoints: 1,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltYellow, flashBoltRed, nimblismBlue, nimblismYellow],
          resourcePoints: 0,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);

      Dash.play(hyperDriverRed);
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabCard(Dash, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
      Dash.endTurn();

      for (const [bolt, pitch, expectedLife] of mode === "accept"
        ? ([
            [flashBoltYellow, nimblismBlue, 19],
            [flashBoltRed, nimblismYellow, 17],
          ] as const)
        : ([
            [flashBoltYellow, nimblismBlue, 18],
            [flashBoltRed, nimblismYellow, 15],
          ] as const)) {
        Oscilio.must.pitch(pitch).play(bolt, { target: Dash.id });
        game.passBoth();
        if (mode === "accept") {
          Dash.choose(steamPreventionOption);
          Dash.targetRequired(hyperDriverRed);
        } else {
          Dash.chooseOptions();
        }
        game.untilIdle({ optionals: "throw", entityTargets: "throw" });
        expectFabPlayer(Dash).toHaveLife(expectedLife);
      }

      expectFabCard(Dash, hyperDriverRed)
        .toBeIn("arena")
        .toHaveCounters(mode === "accept" ? 1 : 3, "steam");
      expectFabCard(Dash, mbrioBaseVizier).toBeIn("head");
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(1).toHaveHandCount(0);
      expectWait(game).toBeIdle();
    });
  }

  it("chooses exactly one controlled Hyper Driver to pay the steam cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [hyperDriverRed, hyperDriverYellow],
        head: [mbrioBaseVizier],
        resourcePoints: 2,
        actionPoints: 2,
        deck: padding(),
      },
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow, nimblismBlue, nimblismYellow, nimblismRed],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.play(hyperDriverRed);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Dash.play(hyperDriverYellow);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Dash.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Dash.id });
    game.passBoth();
    Dash.choose(steamPreventionOption);
    Dash.targetRequired(hyperDriverYellow);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
    expectFabCard(Dash, hyperDriverYellow).toBeIn("arena").toHaveCounters(1, "steam");
    expectFabCard(Dash, mbrioBaseVizier).toBeIn("head");
    expectWait(game).toBeIdle();
  });

  it("without a Hyper Driver, Arcane Barrier 1 may pay one resource", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: padding(),
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        head: [mbrioBaseVizier],
        resourcePoints: 1,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(flashBoltYellow, { target: Dash.id });
    game.passBoth();
    Dash.choose("arcane-barrier");
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(19).toHaveResourceCount(0);
    expectFabCard(Dash, mbrioBaseVizier).toBeIn("head");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("without steam, resources, or a pitchable hand, two arcane is unprevented", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: padding(),
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        head: [mbrioBaseVizier],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(flashBoltYellow, { target: Dash.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(18).toHaveResourceCount(0);
    expectFabCard(Dash, mbrioBaseVizier).toBeIn("head");
    expectWait(game).toBeIdle();
  });

  it("physical damage neither removes steam nor uses the prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [hyperDriverRed],
        head: [mbrioBaseVizier],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: oscilio,
        life: 20,
        hand: [snatchRed],
        actionPoints: 1,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.play(hyperDriverRed);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Dash.endTurn();
    Oscilio.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
    expectFabCard(Dash, mbrioBaseVizier).toBeIn("head");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveHandCount(4);
    expectWait(game).toBeIdle();
  });
});
