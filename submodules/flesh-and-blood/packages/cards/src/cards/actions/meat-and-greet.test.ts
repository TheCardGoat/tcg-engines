import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabCard,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { briar } from "../heroes/briar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { vaporizeShockYellow } from "../instants/vaporize-shock.ts";
import { meatAndGreetRed, meatAndGreetYellow, meatAndGreetBlue } from "./meat-and-greet.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

// Briar and Meat and Greet hit triggers commute: listed ordering only chooses
// between creating Embodiment of Earth and creating Runechant.
describe("Meat and Greet (CRU151) AAA", () => {
  it("happy: when this hits, create a Runechant token under your control", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: padding() },
      { hero: dash, hand: [], life: 20, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(meatAndGreetRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
    expectCombat(game).toBeClosed();
  });

  it("boundary: a miss creates no Runechant token", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: padding() },
      { hero: dash, hand: [brutalAssaultBlue, snatchRed], life: 20, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(meatAndGreetRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, snatchRed]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });

  it("timing: the hit Runechant pings 1 arcane on the next attack action, then is replaced by the new hit's token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [meatAndGreetRed, meatAndGreetRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: padding(),
      },
      { hero: dash, hand: [], life: 20, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);

    Briar.playAttack(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expectCombat(game).toBeClosed();
  });

  it("boundary: with no arcane damage dealt this turn, the attack refunds no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [meatAndGreetRed], actionPoints: 1, resourcePoints: 1, deck: padding() },
      { hero: dash, hand: [], life: 20, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });

    // The hit created a Runechant token but dealt no ARCANE damage this turn:
    // the printed conditional grants no go again, so the action point that
    // paid for the attack stays spent (CR 7.6.2).
    expectFabPlayer(Briar).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
  });

  it("go again: once the Runechant ping has dealt arcane damage, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [meatAndGreetRed, meatAndGreetRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: padding(),
      },
      { hero: dash, hand: [], life: 20, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // First copy: hits for 4 and creates a Runechant, but no arcane damage
    // has been dealt yet, so no refund (AP 2 → 1).
    Briar.playAttack(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Briar).toHaveAP(1);

    // Second copy: playing an attack action triggers the Runechant ping
    // (1 arcane damage) before chain-link resolution, so the conditional
    // go again refunds the action point (AP 1 → 0 → 1).
    Briar.playAttack(meatAndGreetRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});

for (const { card, pitch, power } of [
  { card: meatAndGreetRed, pitch: "red", power: 4 },
  { card: meatAndGreetYellow, pitch: "yellow", power: 3 },
  { card: meatAndGreetBlue, pitch: "blue", power: 2 },
]) {
  for (const recipient of ["self", "opponent"] as const) {
    it(`${pitch}: Shock to ${recipient} ${recipient === "opponent" ? "enables" : "does not enable"} go again`, () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          life: 20,
          hand: [vaporizeShockYellow, card, snatchRed],
          actionPoints: 1,
          resourcePoints: 1,
          deck: padding(),
        },
        { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Dash = game.as(dash);
      Briar.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId:
          recipient === "self" ? Briar.ref(briar).instanceId : Dash.ref(dash).instanceId,
      });
      game.passBoth();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Briar)
        .toHaveLife(recipient === "self" ? 19 : 20)
        .toHaveAP(1);
      expectFabPlayer(Dash).toHaveLife(recipient === "opponent" ? 19 : 20);

      Briar.playAttack(card);
      expectCombat(game).toHaveAttackPower(power);
      game.closeCombat({ optionals: "throw", ordering: "listed" });
      expectFabPlayer(Briar)
        .toHaveAP(recipient === "opponent" ? 1 : 0)
        .toHaveTokenCount("runechant", 1);
      expectFabPlayer(Dash).toHaveLife((recipient === "opponent" ? 19 : 20) - power);
      expectFabCard(Briar, snatchRed).toBeIn("hand");
      expectCombat(game).toBeClosed();
      expectWait(game).toBeIdle();

      if (recipient === "opponent") {
        Briar.playAttack(snatchRed);
        game.closeCombat({ optionals: "throw", ordering: "listed" });
        // Runechant deals one arcane, then Snatch deals four physical and draws.
        expectFabPlayer(Dash).toHaveLife(14 - power);
        expectFabPlayer(Briar).toHaveAP(0).toHaveTokenCount("runechant", 0).toHaveHandCount(1);
        expectFabCard(Briar, snatchRed).toBeIn("graveyard");
        expectWait(game).toBeIdle();
      }
    });
  }
}
