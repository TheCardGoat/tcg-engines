import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { spellbladeStrikeRed } from "./spellblade-strike.ts";
import { snatchRed } from "./snatch.ts";
import { succumbToTemptationYellow } from "./succumb-to-temptation.ts";

describe("Succumb to Temptation (ROS119) AAA", () => {
  it("happy: the next Runeblade attack-action hit discards a chosen card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [succumbToTemptationYellow, spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(succumbToTemptationYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
    Briar.attackWith(spellbladeStrikeRed);
    game.advanceCombatTo("defend");
    Dash.defendWith();
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      entityTargetCanonicalId: snatchRed.canonicalId,
    });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a non-Runeblade attack-action hit does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [succumbToTemptationYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [spellbladeStrikeRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(succumbToTemptationYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, spellbladeStrikeRed).toBeIn("hand");
  });

  it("timing: after dealing arcane this turn it may be played as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [volticBoltRed, succumbToTemptationYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(volticBoltRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(0);
    Briar.play(succumbToTemptationYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, succumbToTemptationYellow).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
