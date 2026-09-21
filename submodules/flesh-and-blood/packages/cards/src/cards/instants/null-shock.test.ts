import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneGloves } from "../equipment/nullrune-gloves.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { countYourBlessingsBlue } from "./count-your-blessings.ts";
import { aetherizeBlue } from "./aetherize.ts";
import { sigilOfSolaceRed, sigilOfSolaceYellow } from "./sigil-of-solace.ts";
import { vaporizeShockYellow } from "./vaporize-shock.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { nullShockYellow } from "./null-shock.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

describe("Null // Shock (ROS023)", () => {
  it("Shock deals one arcane for one resource without spending an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [nullShockYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);
    Oscilio.play(nullShockYellow, {
      playMethod: { kind: "face", face: "right" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Oscilio).toHaveAP(1).toHaveResourceCount(0);
    expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  for (const recipient of ["none", "self", "opponent"] as const) {
    it(`Null after ${recipient} damage: condition controls negation, not target legality`, () => {
      const game = FabTestEngine.start(
        { hero: dash, life: 20, hand: [sigilOfSolaceRed], resourcePoints: 0, deck: padding() },
        {
          hero: oscilio,
          life: 20,
          hand: recipient === "none" ? [nullShockYellow] : [nullShockYellow, vaporizeShockYellow],
          resourcePoints: 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);
      Dash.play(sigilOfSolaceRed);
      Dash.pass();
      if (recipient !== "none") {
        Oscilio.play(vaporizeShockYellow, {
          playMethod: { kind: "face", face: "right" },
          targetInstanceId:
            recipient === "self" ? Oscilio.ref(oscilio).instanceId : Dash.ref(dash).instanceId,
        });
        game.passBoth();
        Dash.pass();
      }
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: Dash.cardIn("stack", sigilOfSolaceRed).instanceId,
      });
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash).toHaveLife(recipient === "opponent" ? 19 : 23);
      expectFabPlayer(Oscilio)
        .toHaveLife(recipient === "self" ? 19 : 20)
        .toHaveResourceCount(0)
        .toHaveHandCount(0);
      expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }
  for (const recipient of ["self", "opponent"] as const) {
    it(`meld checks ${recipient} Shock damage when Null resolves, after declaration`, () => {
      const game = FabTestEngine.start(
        { hero: dash, life: 20, hand: [sigilOfSolaceRed], resourcePoints: 0, deck: padding() },
        { hero: oscilio, life: 20, hand: [nullShockYellow], resourcePoints: 2, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);
      Dash.play(sigilOfSolaceRed);
      Dash.pass();
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "meld" },
        targetInstanceId:
          recipient === "self" ? Oscilio.ref(oscilio).instanceId : Dash.ref(dash).instanceId,
      });
      // Sigil is the sole instant candidate for Null. Shock's target is explicit.
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash).toHaveLife(recipient === "opponent" ? 19 : 23);
      expectFabPlayer(Oscilio)
        .toHaveLife(recipient === "self" ? 19 : 20)
        .toHaveResourceCount(0)
        .toHaveHandCount(0);
      expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }

  for (const damage of [0, 1, 2]) {
    it(`cost-one Shock with ${damage} prior arcane: negates only above equality`, () => {
      const game = FabTestEngine.start(
        { hero: briar, life: 20, hand: [nullShockYellow], resourcePoints: 1, deck: padding() },
        {
          hero: oscilio,
          life: 20,
          hand: [nullShockYellow, ...Array.from({ length: damage }, () => vaporizeShockYellow)],
          resourcePoints: 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Oscilio = game.as(oscilio);
      Briar.play(nullShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId: Oscilio.ref(oscilio).instanceId,
      });
      Briar.pass();
      for (let i = 0; i < damage; i++) {
        Oscilio.play(vaporizeShockYellow, {
          playMethod: { kind: "face", face: "right" },
          targetInstanceId: Briar.ref(briar).instanceId,
        });
        game.passBoth();
        Briar.pass();
      }
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: Briar.cardIn("stack", nullShockYellow).instanceId,
      });
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Briar)
        .toHaveLife(20 - damage)
        .toHaveResourceCount(0)
        .toHaveHandCount(0);
      expectFabPlayer(Oscilio)
        .toHaveLife(damage === 2 ? 20 : 19)
        .toHaveResourceCount(0)
        .toHaveHandCount(0);
      expectFabCard(Briar, nullShockYellow).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }

  for (const recipient of ["self", "opponent"] as const) {
    it(`Shock to ${recipient} in response to Null changes the resolution-time comparison`, () => {
      const game = FabTestEngine.start(
        { hero: dash, life: 20, hand: [sigilOfSolaceRed], resourcePoints: 0, deck: padding() },
        {
          hero: oscilio,
          life: 20,
          hand: [nullShockYellow, vaporizeShockYellow],
          resourcePoints: 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);
      Dash.play(sigilOfSolaceRed);
      Dash.pass();
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: Dash.cardIn("stack", sigilOfSolaceRed).instanceId,
      });
      expectFabCard(Oscilio, nullShockYellow).toBeIn("stack");
      expectFabPlayer(Dash).toHaveLife(20);
      expectFabPlayer(Oscilio).toHaveLife(20);
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId:
          recipient === "self" ? Oscilio.ref(oscilio).instanceId : Dash.ref(dash).instanceId,
      });
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash).toHaveLife(recipient === "opponent" ? 19 : 23);
      expectFabPlayer(Oscilio)
        .toHaveLife(recipient === "self" ? 19 : 20)
        .toHaveResourceCount(0)
        .toHaveHandCount(0);
      expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectFabCard(Oscilio, vaporizeShockYellow).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }

  for (const target of ["red", "yellow", "removed-red"] as const) {
    it(`Null preserves declared target identity among two instants: ${target}`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          life: 20,
          hand: [sigilOfSolaceRed, sigilOfSolaceYellow],
          resourcePoints: 0,
          deck: padding(),
        },
        {
          hero: oscilio,
          life: 20,
          hand:
            target === "removed-red"
              ? [nullShockYellow, vaporizeShockYellow, aetherizeBlue]
              : [nullShockYellow, vaporizeShockYellow],
          resourcePoints: target === "removed-red" ? 2 : 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);
      Dash.play(sigilOfSolaceYellow);
      Dash.play(sigilOfSolaceRed);
      Dash.pass();
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId: Dash.ref(dash).instanceId,
      });
      game.passBoth();
      Dash.pass();
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: Dash.cardIn(
          "stack",
          target === "yellow" ? sigilOfSolaceYellow : sigilOfSolaceRed,
        ).instanceId,
      });
      if (target === "removed-red") {
        Oscilio.play(aetherizeBlue, {
          targetInstanceId: Dash.cardIn("stack", sigilOfSolaceRed).instanceId,
        });
        game.passBoth();
        expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
        expectFabCard(Dash, sigilOfSolaceYellow).toBeIn("stack");
        expectFabCard(Oscilio, nullShockYellow).toBeIn("stack");
        expectFabCard(Oscilio, aetherizeBlue).toBeIn("graveyard");
      }
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash).toHaveLife(target === "yellow" ? 22 : 21);
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveHandCount(0);
      expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
      expectFabCard(Dash, sigilOfSolaceYellow).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }

  for (const prevent of [true, false]) {
    it(`partial Arcane Barrier ${prevent ? "paid" : "declined"}: Null counts only damage actually dealt`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          life: 20,
          hand: [countYourBlessingsBlue],
          arms: [nullruneGloves],
          resourcePoints: 3,
          deck: padding(),
        },
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltRed, nullShockYellow],
          resourcePoints: 3,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Oscilio = game.as(oscilio);
      Dash.play(countYourBlessingsBlue);
      Dash.pass();
      Oscilio.play(flashBoltRed, { target: Dash });
      game.passBoth();
      if (prevent) Dash.choose("arcane-barrier");
      else Dash.chooseOptions();
      expectFabPlayer(Dash)
        .toHaveLife(prevent ? 18 : 17)
        .toHaveResourceCount(prevent ? 0 : 1);
      expectFabCard(Dash, countYourBlessingsBlue).toBeIn("stack");
      Dash.pass();
      Oscilio.play(nullShockYellow, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: Dash.cardIn("stack", countYourBlessingsBlue).instanceId,
      });
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash).toHaveLife(prevent ? 19 : 17);
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveHandCount(0);
      expectFabCard(Dash, countYourBlessingsBlue).toBeIn("graveyard");
      expectFabCard(Oscilio, flashBoltRed).toBeIn("graveyard");
      expectFabCard(Oscilio, nullShockYellow).toBeIn("graveyard");
      expectFabCard(Dash, nullruneGloves).toBeIn("arms");
      expectWait(game).toBeIdle();
    });
  }
});
