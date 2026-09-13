import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { burnUpShockRed } from "./burn-up-shock.ts";

describe("Burn Up // Shock (AUA017) AAA", () => {
  it("happy: Shock face deals 1 arcane to the declared target and spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [burnUpShockRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(burnUpShockRed, {
      playMethod: { kind: "face", face: "right" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, burnUpShockRed).toBeIn("graveyard");
  });

  it("boundary: Burn Up face does not deal Shock's 1 arcane on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [burnUpShockRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(burnUpShockRed, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, burnUpShockRed).toBeIn("graveyard");
  });

  it("the next attack you control that hits a hero this turn deals 4 arcane to them", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [burnUpShockRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(burnUpShockRed, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();
    expectFabCard(Briar, burnUpShockRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.attackWith(brutalAssaultBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("timing: a blocked miss does not deal the delayed 4 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [burnUpShockRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [brutalAssaultBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(burnUpShockRed, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();
    Briar.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, nimblismBlue]);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
  });
});
