import { aladdinHeroicOutlaw, goofyMusketeer, stolenScimitar } from "@tcg/lorcana-cards/cards/001";
import {
  blueSmoke,
  darkwingDuckCoolUnderPressure,
  darkwingDuckCrimeFighter,
  darkwingDuckDashingGadgeteer,
  darkwingDuckDrakeMallard,
  darkwingsChairSet,
  darkwingsGasDevice,
  launchpadHideoutDefender,
  launchpadTrustySidekick,
} from "@tcg/lorcana-cards/cards/011";
import {
  aladdinGenieMischievousPals,
  darkwingDuckLaunchpadStCanardsFinest,
  darkwingDuckShadowySuperhero,
  launchpadSkyPatrol,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "../../fixture-factory.js";

/**
 * Visual board for Darkwing's Chair Set SUDDEN SPIN name matching,
 * including CR 5.2.6.1 ampersand team names.
 *
 * Open: http://localhost:5174/tests/regressions/darkwings-chair-set-ampersand-heal
 *
 * How to use:
 * 1. Activate a ready Darkwing's Chair Set (SUDDEN SPIN: exert + banish).
 * 2. Choose a damaged character and confirm the damage-to-remove cap:
 *    - Solo Darkwing Duck / Darkwing Duck & Launchpad → up to 4
 *    - Solo Launchpad / Goofy (non-Darkwing) → up to 2
 * 3. Repeat with remaining Chair Sets to exercise each target.
 * 4. Activate Stolen Scimitar targeting Aladdin vs Aladdin & Genie
 *    (same selected-target-name selfReplacement pattern: +2 vs +1).
 * 5. Optional: play Blue Smoke / Gas Device with the team in play to check
 *    has-named-character "Darkwing Duck" board conditions.
 */
export const darkwingsChairSetAmpersandHealRegression = createFixture({
  id: "darkwings-chair-set-ampersand-heal",
  name: "Darkwing's Chair Set - Ampersand name heal (team + solos)",
  description:
    "Manual UI board for SUDDEN SPIN heal amounts. Stage multiple ready Chair Sets and damaged Darkwing Duck, Launchpad, Darkwing Duck & Launchpad, plus Stolen Scimitar with Aladdin / Aladdin & Genie for the same named-self-replacement path. Expect up to 4 on any Darkwing Duck name (including the team) and up to 2 otherwise.",
  skipPreGame: true,
  seed: "darkwings-chair-set-ampersand-heal-2026-08-01",
  playerOne: {
    // Ink for Blue Smoke / Gas Device activations and headroom
    inkwell: 8,
    hand: [darkwingsChairSet, darkwingsChairSet, blueSmoke, darkwingsGasDevice, stolenScimitar],
    play: [
      // Multiple ready items: ability banishes the Chair Set on activation
      darkwingsChairSet,
      darkwingsChairSet,
      darkwingsChairSet,
      darkwingsChairSet,
      stolenScimitar,

      // Named Darkwing Duck — expect heal up to 4
      { card: darkwingDuckLaunchpadStCanardsFinest, isDrying: false, damage: 4 },
      { card: darkwingDuckCoolUnderPressure, isDrying: false, damage: 4 },
      { card: darkwingDuckDashingGadgeteer, isDrying: false, damage: 4 },
      { card: darkwingDuckShadowySuperhero, isDrying: false, damage: 4 },
      { card: darkwingDuckCrimeFighter, isDrying: false, damage: 2 },
      { card: darkwingDuckDrakeMallard, isDrying: false, damage: 1 },

      // Solo Launchpad — expect heal up to 2 only
      { card: launchpadHideoutDefender, isDrying: false, damage: 4 },
      { card: launchpadSkyPatrol, isDrying: false, damage: 4 },
      { card: launchpadTrustySidekick, isDrying: false, damage: 3 },

      // Non-Darkwing control — expect heal up to 2
      { card: goofyMusketeer, isDrying: false, damage: 4 },

      // Stolen Scimitar targets (selfReplacement named Aladdin)
      { card: aladdinGenieMischievousPals, isDrying: false },
      { card: aladdinHeroicOutlaw, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    hand: [],
    deck: 10,
    lore: 0,
  },
});
