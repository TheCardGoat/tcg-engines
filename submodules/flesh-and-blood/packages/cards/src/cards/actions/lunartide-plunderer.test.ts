import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";

import { snatchRed } from "./snatch.ts";
import { lunartidePlundererRed } from "./lunartide-plunderer.ts";

/**
 * Lunartide Plunderer (MON206) — Shadow Action - Attack. Red cost 3, 7{p}/2{d}.
 * If this hits a hero, banish it and a card from their soul.
 */

describe("Lunartide Plunderer (MON206) AAA", () => {
  it("happy: when this hits a hero, banish it and a card from their soul", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [lunartidePlundererRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], soul: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);
    const Dash = game.as(dash);

    Levia.playAttack(lunartidePlundererRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Levia, lunartidePlundererRed).toBeBanished();
    expect(Dash.zone("soul")).toHaveLength(0);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: a blocked miss does not banish this or a soul card", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [lunartidePlundererRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed, pulseOfIsenloftBlue],
        resourcePoints: 2,
        soul: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);
    const Dash = game.as(dash);

    Levia.playAttack(lunartidePlundererRed);
    Dash.defendWith(nimblismBlue, snatchRed);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabCard(Levia, lunartidePlundererRed).toBeIn("graveyard");
    expect(Dash.zone("soul")).toHaveLength(1);
  });

  it("timing: this stays on the chain until the hit resolves — not banished on declaration", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [lunartidePlundererRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], soul: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.playAttack(lunartidePlundererRed);
    expectFabCard(Levia, lunartidePlundererRed).toBeIn("combatChain");
    expect(game.as(dash).zone("soul")).toHaveLength(1);
  });
});
