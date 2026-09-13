import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { amnesiaRed } from "./amnesia.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { beseechTheDemigonRed } from "./beseech-the-demigon.ts";
import { widespreadRuinRed } from "./widespread-ruin.ts";
import { deathlyDelightRed } from "./deathly-delight.ts";

describe("Beseech the Demigon (DTD187) AAA", () => {
  it("happy: the chosen banished attack action gets +3{p} until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [beseechTheDemigonRed],
        banished: [amnesiaRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expectFabCard(Fai, amnesiaRed).toHavePower(6);
    Fai.play(beseechTheDemigonRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: amnesiaRed.canonicalId });

    expectFabCard(Fai, beseechTheDemigonRed).toBeIn("graveyard");
    expectFabCard(Fai, amnesiaRed).toHavePower(9);
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a non-attack-action in the banished zone cannot be chosen", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [beseechTheDemigonRed],
        banished: [crackedBaubleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expect(() => Fai.play(beseechTheDemigonRed)).toThrow(/no legal target/i);
    expectFabCard(Fai, crackedBaubleYellow).toBeBanished();
    expect(Fai.zone("hand")).toContain(beseechTheDemigonRed.canonicalId);
  });

  it("happy: choosing among two banished attack actions still gives +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [beseechTheDemigonRed],
        banished: [amnesiaRed, widespreadRuinRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(beseechTheDemigonRed, { targetCard: amnesiaRed });
    game.untilIdle();

    expectFabCard(Fai, beseechTheDemigonRed).toBeIn("graveyard");
    expectFabCard(Fai, amnesiaRed).toHavePower(9);
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("happy: Vynnset can Beseech a Rune Gate attack in the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [beseechTheDemigonRed],
        banished: [deathlyDelightRed, widespreadRuinRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(beseechTheDemigonRed, { targetCard: widespreadRuinRed });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Vynnset, beseechTheDemigonRed).toBeIn("graveyard");
    expectFabCard(Vynnset, widespreadRuinRed).toHavePower(9);
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("timing: lethal Blood Debt ends the game before another Beseech", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        life: 1,
        hand: [beseechTheDemigonRed],
        banished: [deathlyDelightRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.endTurn();

    expect(game.hasGameEnded()).toBe(true);
    expectFabPlayer(Vynnset).toHaveLife(0);
    expectFabCard(Vynnset, beseechTheDemigonRed).toBeIn("hand");
  });
});
