import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { stingOfSorceryBlue } from "./sting-of-sorcery.ts";
import { runebloodIncantationRed as runebloodIncantation } from "./runeblood-incantation.ts";
import { snatchRed } from "./snatch.ts";
import { sonataGalaxiaRed } from "./sonata-galaxia.ts";

describe("Sonata Galaxia (HVY251) AAA", () => {
  it("happy: the action resolves and refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sonataGalaxiaRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sonataGalaxiaRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, sonataGalaxiaRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: with no Runechants in play the printed go again still refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sonataGalaxiaRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabPlayer(Briar).toHaveAP(1);
    Briar.play(sonataGalaxiaRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("happy: paying X=1 searches a cost-1 Runeblade aura into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sonataGalaxiaRed],
        deck: [stingOfSorceryBlue, runebloodIncantation, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sonataGalaxiaRed, { xValue: 1 });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: runebloodIncantation.canonicalId,
    });

    expectFabCard(Briar, runebloodIncantation).toBeIn("arena");
    expectFabCard(Briar, sonataGalaxiaRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: X=0 cannot search a cost-1 Runeblade aura", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sonataGalaxiaRed],
        deck: [runebloodIncantation, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(sonataGalaxiaRed, { xValue: 0 });
    game.helpers.resolveUntilIdle();

    expect(Briar.zone("deck")).toContain(runebloodIncantation.canonicalId);
    expectFabCard(Briar, sonataGalaxiaRed).toBeIn("graveyard");
  });
});
