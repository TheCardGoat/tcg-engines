import { stirTheAetherwindsBlue } from "./stir-the-aetherwinds.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { stirTheAetherwindsRed } from "./stir-the-aetherwinds.ts";
import { zapBlue } from "./zap.ts";
import { zapRed } from "./zap.ts";

/**
 * Stir the Aetherwinds Red (ARC129) — Wizard Action.
 *
 * Printed: You may play your next Wizard 'non-attack' action card this turn
 * as though it were an instant and if it has an effect that deals arcane
 * damage, instead that effect deals that much arcane damage plus 3.
 */

describe("Stir the Aetherwinds (ARC129) AAA", () => {
  it("happy: next Wizard non-attack action plays as an instant with +3 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [stirTheAetherwindsRed, zapRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(stirTheAetherwindsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Kano.must.playInstant(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    // Zap (3 arcane) played through the Stir permission as an instant:
    // no action point spent, arcane damage amped to 6.
    expectFabPlayer(Dash).toHaveLife(14); // 20 - (3 + 3)
    expectFabPlayer(Kano).toHaveAP(0);
    expectFabCard(Kano, zapRed).toBeIn("graveyard");
    expectFabCard(Kano, stirTheAetherwindsRed).toBeIn("graveyard");
  });

  it("boundary: without the permission Zap is not playable as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [stirTheAetherwindsRed, zapRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(stirTheAetherwindsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabUnplayable(
      () => Kano.must.playInstant(zapRed, { target: Dash.id }),
      /action-point cost cannot be paid/i,
    );
    expectFabCard(Kano, zapRed).toBeIn("hand");
  });

  it("timing: the arcane amp does not leak to later turns", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [stirTheAetherwindsRed, zapRed, zapBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(stirTheAetherwindsRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: zapRed.canonicalId,
    });
    Kano.must.playInstant(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(14);

    Kano.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Kano.play(zapBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    // Unamped Zap blue deals its printed 1 arcane only.
    expectFabPlayer(Dash).toHaveLife(13); // 14 - 1
  });

  it("happy: next Wizard non-attack action plays as an instant with +1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [stirTheAetherwindsBlue, zapRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(stirTheAetherwindsBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Kano.must.playInstant(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    // Zap (3 arcane) amped to 4, no action point spent on the instant play.
    expectFabPlayer(Dash).toHaveLife(16); // 20 - (3 + 1)
    expectFabPlayer(Kano).toHaveAP(0);
    expectFabCard(Kano, zapRed).toBeIn("graveyard");
  });
});
