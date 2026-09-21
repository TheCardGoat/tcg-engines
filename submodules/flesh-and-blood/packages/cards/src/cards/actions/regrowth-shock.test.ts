import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { regrowthShockBlue } from "./regrowth-shock.ts";
import { vaporizeShockYellow } from "../instants/vaporize-shock.ts";
import { snatchRed } from "./snatch.ts";
import { meatAndGreetRed } from "./meat-and-greet.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

// ROS253: recover one attack action with cost strictly less than opposing-hero
// arcane damage this turn. Each meld half costs zero; Regrowth has go again.
describe("Regrowth // Shock (ROS253)", () => {
  it("X=0 cannot recover even a cost-zero attack", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [regrowthShockBlue],
        graveyard: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: dash, hand: [], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    Briar.play(regrowthShockBlue, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();
    // If a faulty threshold admits Snatch, resolve that sole mandatory choice
    // so the graveyard assertion, rather than an unexpected-prompt guard, fails.
    game.untilIdle({ optionals: "throw", entityTargets: "minimum" });
    expectFabPlayer(Briar).toHaveAP(1).toHaveHandCount(0);
    expectFabCard(Briar, snatchRed).toBeIn("graveyard");
    expectFabCard(Briar, regrowthShockBlue).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  for (const recipient of ["self", "opponent"] as const) {
    it(`melded Shock to ${recipient}: only opposing-hero damage enables recovery`, () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          life: 20,
          hand: [regrowthShockBlue],
          graveyard: [snatchRed, meatAndGreetRed, nimblismBlue],
          resourcePoints: 0,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: dash,
          life: 20,
          hand: [],
          graveyard: [snatchRed],
          resourcePoints: 0,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Dash = game.as(dash);
      Briar.play(regrowthShockBlue, {
        playMethod: { kind: "meld" },
        targetInstanceId:
          recipient === "self" ? Briar.ref(briar).instanceId : Dash.ref(dash).instanceId,
      });
      game.passBoth();
      game.passBoth();
      // Under the recipient mutant the only eligible recovery is own Snatch.
      game.untilIdle({ optionals: "throw", entityTargets: "minimum" });
      expectFabPlayer(Briar)
        .toHaveLife(recipient === "self" ? 19 : 20)
        .toHaveAP(1)
        .toHaveHandCount(recipient === "self" ? 0 : 1);
      expectFabPlayer(Dash)
        .toHaveLife(recipient === "self" ? 20 : 19)
        .toHaveHandCount(0);
      expectFabCard(Briar, snatchRed).toBeIn(recipient === "self" ? "graveyard" : "hand");
      expectFabCard(Briar, meatAndGreetRed).toBeIn("graveyard");
      expectFabCard(Briar, nimblismBlue).toBeIn("graveyard");
      expectFabCard(Dash, snatchRed).toBeIn("graveyard");
      expectWait(game).toBeIdle();
      if (recipient === "opponent") {
        Briar.playAttack(snatchRed);
        // Briar's Earth token and Snatch's draw are independent hit triggers.
        game.closeCombat({ optionals: "throw", ordering: "listed" });
        expectFabPlayer(Dash).toHaveLife(15);
        expectFabPlayer(Briar).toHaveAP(0).toHaveHandCount(1);
        expectFabCard(Briar, snatchRed).toBeIn("graveyard");
        expectWait(game).toBeIdle();
      }
    });
  }

  for (const damage of [1, 2, 3]) {
    it(`sums ${damage} separate Shock damage: cost two requires X greater than two`, () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          life: 20,
          hand: [regrowthShockBlue, ...Array.from({ length: damage }, () => vaporizeShockYellow)],
          graveyard: [brutalAssaultBlue],
          resourcePoints: 0,
          actionPoints: 1,
          deck: padding(),
        },
        { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Dash = game.as(dash);
      for (let i = 0; i < damage; i++) {
        Briar.play(vaporizeShockYellow, {
          playMethod: { kind: "face", face: "right" },
          targetInstanceId: Dash.ref(dash).instanceId,
        });
        game.passBoth();
        game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      }
      Briar.play(regrowthShockBlue, { playMethod: { kind: "face", face: "left" } });
      game.passBoth();
      // Brutal Assault is the sole possible mandatory choice; no choice among
      // identities is delegated to the helper, including under threshold mutation.
      game.untilIdle({ optionals: "throw", entityTargets: "minimum" });
      expectFabCard(Briar, brutalAssaultBlue).toBeIn(damage === 3 ? "hand" : "graveyard");
      expectFabPlayer(Briar)
        .toHaveAP(1)
        .toHaveHandCount(damage === 3 ? 1 : 0)
        .toHaveLife(20);
      expectFabPlayer(Dash).toHaveLife(20 - damage);
      expectFabCard(Briar, regrowthShockBlue).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }
});
