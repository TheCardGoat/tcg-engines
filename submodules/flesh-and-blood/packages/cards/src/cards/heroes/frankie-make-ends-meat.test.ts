import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { snatchRed } from "../actions/snatch.ts";
import { frankieMakeEndsMeat } from "./frankie-make-ends-meat.ts";

/**
 * Hero behavior acceptance test — Frankie, Make Ends Meat (LSS021).
 *
 * Printed: Whenever an equipment you control would be put into a graveyard,
 * instead banish it. Action - {r}{r}{r}, {t}: Equip an equipment from a
 * graveyard. Go again.
 */

const opponentHero = dash;

describe("frankie-make-ends-meat (LSS021) AAA", () => {
  it("core mechanic: equipment destruction is replaced with banish, not graveyard", () => {
    // Ironrot Helm's Blade Break destroys it after it defends — Frankie's
    // printed replacement must route that destruction into the banished zone.
    const game = FabTestEngine.start(
      { hero: frankieMakeEndsMeat, head: [ironrotHelm], deck: 6 },
      { hero: opponentHero, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Frankie = game.as(frankieMakeEndsMeat);

    game.as(opponentHero).playAttack(snatchRed, { stopAt: "defend" });
    Frankie.blockWith(ironrotHelm);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Frankie, ironrotHelm).toBeIn("banished");
    expect(Frankie.zone("graveyard")).not.toContain(ironrotHelm.canonicalId);
    expect(Frankie.zone("head")).not.toContain(ironrotHelm.canonicalId);
  });

  it("core mechanic: {r}{r}{r}, {t} equips equipment from a graveyard; go again refunds", () => {
    const game = FabTestEngine.start(
      { hero: frankieMakeEndsMeat, resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: opponentHero, graveyard: [ironrotHelm], hand: [], deck: 6 },
    );
    const Frankie = game.as(frankieMakeEndsMeat);

    Frankie.activate(frankieMakeEndsMeat);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Frankie, ironrotHelm).toBeIn("head");
    expectFabPlayer(Frankie).toHaveResourceCount(0);
    // −1 AP to activate the Action, +1 from the printed Go again.
    expectFabPlayer(Frankie).toHaveAP(1);
  });

  it("boundaries: 2 of the printed 3{r} still demands the missing resource", () => {
    const game = FabTestEngine.start(
      { hero: frankieMakeEndsMeat, resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: opponentHero, graveyard: [ironrotHelm], hand: [], deck: 6 },
    );
    const Frankie = game.as(frankieMakeEndsMeat);

    Frankie.activate(frankieMakeEndsMeat);

    // The unpaid {r} must be collected before the equip can resolve — the
    // ability layer waits on a payment decision and nothing is equipped.
    expectWait(game).toHaveDecision("payment");
    expectFabCard(game.as(opponentHero), ironrotHelm).toBeIn("graveyard");
  });
});
