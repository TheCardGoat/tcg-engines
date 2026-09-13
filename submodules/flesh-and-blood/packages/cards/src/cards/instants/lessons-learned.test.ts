import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { lessonsLearnedBlue } from "./lessons-learned.ts";
import { singingSteelbladeYellow } from "../attack-reactions/singing-steelblade.ts";
import { twinningBladeYellow } from "../attack-reactions/twinning-blade.ts";
import { glintTheQuicksilverBlue } from "../attack-reactions/glint-the-quicksilver.ts";
import { overpowerRed, overpowerYellow } from "../attack-reactions/overpower.ts";

/**
 * Lessons Learned (MPW036) — Warrior Instant.
 *
 * Printed: "Shuffle up to 3 attack reaction cards with different names from
 * your graveyard into your deck."
 */

describe("Lessons Learned (MPW036) AAA", () => {
  it("happy: three differently named attack reactions are shuffled from the graveyard into the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [lessonsLearnedBlue],
        graveyard: [singingSteelbladeYellow, twinningBladeYellow, glintTheQuicksilverBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(lessonsLearnedBlue);
    game.helpers.untilIdle({ entityTargets: "pause", ordering: "listed" });
    Dori.targetRequired(singingSteelbladeYellow, twinningBladeYellow, glintTheQuicksilverBlue);
    game.helpers.untilIdle({ ordering: "listed" });
    for (const reaction of [
      singingSteelbladeYellow,
      twinningBladeYellow,
      glintTheQuicksilverBlue,
    ]) {
      expect(Dori.cardsIn("graveyard", reaction)).toHaveLength(0);
      expect(Dori.cardsIn("deck", reaction)).toHaveLength(1);
    }
    expectFabCard(Dori, lessonsLearnedBlue).toBeIn("graveyard");
  });

  it("boundary: duplicate names count once — only 3 of 4 attack reactions move", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [lessonsLearnedBlue],
        graveyard: [overpowerRed, overpowerYellow, twinningBladeYellow, glintTheQuicksilverBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(lessonsLearnedBlue);
    game.helpers.untilIdle({ entityTargets: "pause", ordering: "listed" });
    // Two Overpower copies share one name — the player picks one per name.
    Dori.targetRequired(overpowerRed, twinningBladeYellow, glintTheQuicksilverBlue);
    game.helpers.untilIdle({ ordering: "listed" });

    // One Overpower copy stays behind in the graveyard.
    const overpowersLeftInGraveyard =
      Dori.cardsIn("graveyard", overpowerRed).length +
      Dori.cardsIn("graveyard", overpowerYellow).length;
    expect(overpowersLeftInGraveyard).toBe(1);
    expect(Dori.cardsIn("graveyard", twinningBladeYellow)).toHaveLength(0);
    expect(Dori.cardsIn("graveyard", glintTheQuicksilverBlue)).toHaveLength(0);
    expect(Dori.cardsIn("deck", twinningBladeYellow)).toHaveLength(1);
    expect(Dori.cardsIn("deck", glintTheQuicksilverBlue)).toHaveLength(1);
  });
});
