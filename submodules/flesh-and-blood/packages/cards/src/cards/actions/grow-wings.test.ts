import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { snatchRed } from "./snatch.ts";
import { growWingsRed } from "./grow-wings.ts";

/**
 * Grow Wings, Red (HNT089) — Ninja Attack Action, cost 0, 3{p}, 3{d}.
 *
 * Printed: "If a Draconic attack was the last attack this combat chain,
 * this gets go again."
 *
 * Go again is only the last-attack grant (CIN024 class). Last-attack uses
 * `filter.typeBox` Draconic+Attack, never `names:["Draconic Attack"]`.
 */

describe("Grow Wings (HNT089) AAA", () => {
  it("happy: after a Draconic attack link, Grow Wings gets go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeRed, growWingsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.must.playAttack(roninRenegadeRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(growWingsRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14); // 3 (Ronin) + 3 (Grow Wings)
    expectFabPlayer(Fai).toHaveAP(2);
  });

  it("boundary: as the first link there is no go again — the action point stays spent", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growWingsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(growWingsRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("timing/boundary: a non-Draconic last attack (Snatch) grants nothing — no refund", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, growWingsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(growWingsRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13); // 4 (Snatch) + 3 (Grow Wings)
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growWingsRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([growWingsRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);
    expect(Fai.zone("graveyard")).toContain(growWingsRed.canonicalId);
  });
});
