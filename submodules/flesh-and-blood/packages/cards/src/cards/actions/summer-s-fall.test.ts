import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { sigilOfDeadwoodBlue } from "./sigil-of-deadwood.ts";
import { briar } from "../heroes/briar.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { summerSFallRed } from "./summer-s-fall.ts";

describe("Summer's Fall (ROS039) AAA", () => {
  it("happy: decompose puts a controlled aura on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [summerSFallRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        arena: [sigilOfDeadwoodBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(summerSFallRed, { stopAt: "on-attack" });
    Briar.targetRequired(sigilOfDeadwoodBlue);
    game.advanceToDecision(Briar, "boolean");
    Briar.accept();
    Briar.target(autumnSTouchBlue, autumnSTouchBlue);
    Briar.target(snatchRed);
    Briar.target(sigilOfDeadwoodBlue);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expect(Briar.zone("banished")).toHaveLength(3);
    game.closeCombat();
    expect(Briar.cardsIn("deck", sigilOfDeadwoodBlue)).toHaveLength(1);
  });

  it("boundary: an empty graveyard does not open decompose", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [summerSFallRed],
        graveyard: [],
        arena: [sigilOfDeadwoodBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(summerSFallRed, { stopAt: "on-attack" });
    Briar.targetRequired(sigilOfDeadwoodBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabCard(Briar, sigilOfDeadwoodBlue).toBeIn("arena");
  });

  it("timing: declining decompose leaves the aura in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [summerSFallRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        arena: [sigilOfDeadwoodBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(summerSFallRed, { stopAt: "on-attack" });
    Briar.targetRequired(sigilOfDeadwoodBlue);
    game.advanceToDecision(Briar, "boolean");
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();

    expectFabCard(Briar, sigilOfDeadwoodBlue).toBeIn("arena");
  });
});
