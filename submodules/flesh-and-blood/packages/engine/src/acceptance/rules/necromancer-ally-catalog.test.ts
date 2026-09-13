/**
 * Every in-repo Necromancer Ally is a living permanent (printed life, not
 * defense standing in for {h}) and can be selected as an attack target.
 */
import { describe, expect, it } from "vitest";

import { ankaDragUnderYellow } from "../../../../cards/src/cards/actions/anka-drag-under.ts";
import { barnacleYellow } from "../../../../cards/src/cards/actions/barnacle.ts";
import { limpitHopALongYellow } from "../../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { oystenHeartOfGoldYellow } from "../../../../cards/src/cards/actions/oysten-heart-of-gold.ts";
import { riggermortisYellow } from "../../../../cards/src/cards/actions/riggermortis.ts";
import { sawbonesDockHandYellow } from "../../../../cards/src/cards/actions/sawbones-dock-hand.ts";
import { restlessMagisterRed } from "../../../../cards/src/cards/actions/restless-magister.ts";
import { corruptedCorpse } from "../../../../cards/src/cards/actions/corrupted-corpse.ts";
import { booResidentSpookYellow } from "../../../../cards/src/cards/actions/boo-resident-spook.ts";
import { bubbaLubbaRunAgroundYellow } from "../../../../cards/src/cards/actions/bubba-lubba-run-aground.ts";
import { chumFriendlyFirstMateYellow } from "../../../../cards/src/cards/actions/chum-friendly-first-mate.ts";
import { morayLeFayYellow } from "../../../../cards/src/cards/actions/moray-le-fay.ts";
import { wailerHumperdinckYellow } from "../../../../cards/src/cards/actions/wailer-humperdinck.ts";
import { kelpieTangledMessYellow } from "../../../../cards/src/cards/actions/kelpie-tangled-mess.ts";
import { scoobaSaltySeaDogYellow } from "../../../../cards/src/cards/actions/scooba-salty-sea-dog.ts";
import { chowderHeartyCookYellow } from "../../../../cards/src/cards/actions/chowder-hearty-cook.ts";
import { cuttySharkQuickClipYellow } from "../../../../cards/src/cards/actions/cutty-shark-quick-clip.ts";
import { shellyHardenedTravelerYellow } from "../../../../cards/src/cards/actions/shelly-hardened-traveler.ts";
import { swabbieYellow } from "../../../../cards/src/cards/actions/swabbie.ts";
import { gallowEndOfTheLineYellow } from "../../../../cards/src/cards/actions/gallow-end-of-the-line.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

const NECROMANCER_ALLIES = [
  ankaDragUnderYellow,
  barnacleYellow,
  limpitHopALongYellow,
  oystenHeartOfGoldYellow,
  riggermortisYellow,
  sawbonesDockHandYellow,
  restlessMagisterRed,
  corruptedCorpse,
  booResidentSpookYellow,
  bubbaLubbaRunAgroundYellow,
  chumFriendlyFirstMateYellow,
  morayLeFayYellow,
  wailerHumperdinckYellow,
  kelpieTangledMessYellow,
  scoobaSaltySeaDogYellow,
  chowderHeartyCookYellow,
  cuttySharkQuickClipYellow,
  shellyHardenedTravelerYellow,
  swabbieYellow,
  gallowEndOfTheLineYellow,
] as const;

describe("Necromancer Ally catalog (living objects)", () => {
  for (const ally of NECROMANCER_ALLIES) {
    it(`${ally.slug ?? ally.canonicalId} has printed life and is attackable`, () => {
      expect(typeof ally.base.numeric.life).toBe("number");
      expect(ally.base.numeric.life).toBeGreaterThan(0);
      expect(ally.base.numeric.defense).toBeUndefined();

      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, arena: [ally], deck: 6 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const instanceId = game.as(dash).findCardInZone("arena", ally);
      expect(game.objectLife(instanceId)).toBe(ally.base.numeric.life);

      game.as(bravo).attackWith(snatchRed, { target: instanceId });
      expect(game.combat()?.activeLink).toMatchObject({
        defendingPlayerId: game.as(dash).id,
      });
    });
  }

  it("happy: a printed Ally Attack activation opens combat and returns the ally", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [barnacleYellow], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(barnacleYellow);
    game.passBoth();
    expect(Bravo.zone("combatChain")).toContain(barnacleYellow.canonicalId);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("arena")).toContain(barnacleYellow.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(barnacleYellow.canonicalId);
  });
});
