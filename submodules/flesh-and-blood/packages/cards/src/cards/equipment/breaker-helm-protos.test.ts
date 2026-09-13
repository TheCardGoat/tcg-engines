import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { breakerHelmProtos } from "./breaker-helm-protos.ts";

/**
 * Breaker Helm Protos (AMX003) — Mechanologist Base Head, Temper.
 * Printed: "When this defends, you may discard a Hyper Driver. If you do,
 * draw a card and this gets +1{d} until end of turn." (Printed 1{d} base.)
 */

describe("Breaker Helm Protos (AMX003) AAA", () => {
  it("happy: discarding the Hyper Driver draws and buffs this to 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        head: [breakerHelmProtos],
        hand: [hyperDriverRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(breakerHelmProtos);
    game.passBoth(); // surfaces the defend trigger
    Dash.accept();
    Dash.target(hyperDriverRed);

    // Printed 1{d} plus the +1{d} buff.
    expectFabCard(Dash, breakerHelmProtos).toHaveDefense(2);
    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: declining keeps the printed 0{d} and the Hyper Driver in hand", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        head: [breakerHelmProtos],
        hand: [hyperDriverRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(breakerHelmProtos);
    game.passBoth();
    Dash.decline();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, breakerHelmProtos).toHaveDefense(1);
    expectFabCard(Dash, hyperDriverRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
