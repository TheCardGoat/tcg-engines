import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";
import { hundredWindsYellow, hundredWindsRed } from "../actions/hundred-winds.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { maskOfTheSwarmingClaw } from "./mask-of-the-swarming-claw.ts";

const padding = () => Array.from({ length: 6 }, () => nimblismBlue);

describe("Mask of the Swarming Claw (PEN030) AAA", () => {
  for (const mode of ["pay", "decline", "unfunded"] as const) {
    it(`no controlled links: ${mode} Arcane Barrier against two arcane`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltYellow],
          resourcePoints: 2,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: katsu,
          life: 20,
          hand: [],
          head: [maskOfTheSwarmingClaw],
          resourcePoints: mode === "unfunded" ? 0 : 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Katsu = game.as(katsu);
      Oscilio.play(flashBoltYellow, { target: Katsu.id });
      Oscilio.pass();
      Katsu.pass();
      if (mode === "pay") Katsu.choose("arcane-barrier");
      if (mode === "decline") Katsu.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Katsu)
        .toHaveLife(mode === "pay" ? 19 : 18)
        .toHaveResourceCount(mode === "decline" ? 1 : 0);
      expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn("head");
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(0);
      expectWait(game).toBeIdle();
    });
  }

  for (const accept of [true, false]) {
    it(`one controlled link: ${accept ? "accept" : "decline"} Spellvoid before physical combat finishes`, () => {
      const game = FabTestEngine.start(
        {
          hero: katsu,
          life: 20,
          hand: [snatchRed],
          head: [maskOfTheSwarmingClaw],
          resourcePoints: 0,
          actionPoints: 1,
          deck: padding(),
        },
        { hero: oscilio, life: 20, hand: [flashBoltYellow], resourcePoints: 2, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Katsu = game.as(katsu);
      const Oscilio = game.as(oscilio);
      Katsu.playAttack(snatchRed);
      game.toReaction("defender");
      Oscilio.play(flashBoltYellow, { target: Katsu.id });
      Oscilio.pass();
      Katsu.pass();
      if (accept) Katsu.choose("spellvoid");
      else Katsu.chooseOptions();
      // Declining Katsu makes its hit trigger commute with Snatch's mandatory draw.
      game.closeCombat({ optionals: "decline", entityTargets: "throw", ordering: "listed" });
      expectFabPlayer(Katsu)
        .toHaveLife(accept ? 19 : 18)
        .toHaveAP(0)
        .toHaveResourceCount(0)
        .toHaveHandCount(1);
      expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn(accept ? "graveyard" : "head");
      expectFabPlayer(Oscilio).toHaveLife(16).toHaveResourceCount(0).toHaveHandCount(0);
      expectFabCard(Katsu, snatchRed).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }

  it("opposing physical attack does not destroy or use the mask", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, life: 20, hand: [snatchRed], actionPoints: 1, deck: padding() },
      {
        hero: katsu,
        life: 20,
        hand: [],
        head: [maskOfTheSwarmingClaw],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Katsu = game.as(katsu);
    Oscilio.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Katsu).toHaveLife(16).toHaveResourceCount(0);
    expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn("head");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveHandCount(1);
    expectWait(game).toBeIdle();
  });
  for (const accept of [true, false]) {
    it(`two controlled links: ${accept ? "accept" : "decline"} Spellvoid, then no prevention after chain close`, () => {
      const game = FabTestEngine.start(
        {
          hero: katsu,
          life: 20,
          hand: [hundredWindsYellow, hundredWindsRed],
          head: [maskOfTheSwarmingClaw],
          resourcePoints: 0,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltYellow, flashBoltYellow],
          resourcePoints: 4,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Katsu = game.as(katsu);
      const Oscilio = game.as(oscilio);
      Katsu.playAttack(hundredWindsYellow);
      game.advanceUntil({ stopAt: "resolution", optionals: "decline", entityTargets: "throw" });
      expectFabPlayer(Oscilio).toHaveLife(18);
      Katsu.playAttack(hundredWindsRed);
      game.toReaction("defender");
      Oscilio.play(flashBoltYellow, { target: Katsu.id });
      Oscilio.pass();
      Katsu.pass();
      if (accept) Katsu.choose("spellvoid");
      else Katsu.chooseOptions();
      game.closeCombat({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Katsu)
        .toHaveLife(accept ? 20 : 18)
        .toHaveAP(1)
        .toHaveHandCount(0)
        .toHaveResourceCount(0);
      expectFabPlayer(Oscilio).toHaveLife(14).toHaveResourceCount(2);
      expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn(accept ? "graveyard" : "head");
      expectFabCard(Katsu, hundredWindsYellow).toBeIn("graveyard");
      expectFabCard(Katsu, hundredWindsRed).toBeIn("graveyard");
      Katsu.pass();
      Oscilio.play(flashBoltYellow, { target: Katsu.id });
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Katsu)
        .toHaveLife(accept ? 18 : 16)
        .toHaveResourceCount(0);
      expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn(accept ? "graveyard" : "head");
      expectFabPlayer(Oscilio).toHaveLife(14).toHaveResourceCount(0).toHaveHandCount(0);
      expectWait(game).toBeIdle();
    });
  }

  it("opposing chain link grants no Spellvoid prevention during an arcane response", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [snatchRed, flashBoltYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: katsu,
        life: 20,
        hand: [],
        head: [maskOfTheSwarmingClaw],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Katsu = game.as(katsu);
    Oscilio.playAttack(snatchRed);
    game.toReaction("attacker");
    Oscilio.play(flashBoltYellow, { target: Katsu.id });
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Katsu).toHaveLife(14).toHaveResourceCount(0);
    expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn("head");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveAP(0).toHaveHandCount(1);
    expectWait(game).toBeIdle();
  });
});
