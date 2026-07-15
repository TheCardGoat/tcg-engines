// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/06-abilities-effects-and-resolving.md

import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "@tcg/lorcana-types";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  aladdinHeroicOutlaw,
  flounderVoiceOfReason,
  heiheiBoatSnack,
  stolenScimitar,
} from "@tcg/lorcana-cards/cards/001";
import { beastSelflessProtector } from "@tcg/lorcana-cards/cards/002";
import { hadesMeticulousPlotter, sisuWiseFriend, tongSurvivor } from "@tcg/lorcana-cards/cards/004";
import { snugglyDucklingDisreputablePub } from "@tcg/lorcana-cards/cards/004";
import { sevenDwarfsMineSecureFortress, sleepySluggishKnight } from "@tcg/lorcana-cards/cards/005";
import { thisIsMyFamily } from "@tcg/lorcana-cards/cards/007";
import { maxGoofChartTopper } from "@tcg/lorcana-cards/cards/009";
import { rapunzelReadyForAdventure } from "@tcg/lorcana-cards/cards/010";

function getInstancesByDefinitionId(
  testEngine: LorcanaMultiplayerTestEngine,
  zone: "play" | "deck" | "discard" | "hand",
  playerId: typeof PLAYER_ONE | typeof PLAYER_TWO,
  definitionId: string,
): CardInstanceId[] {
  return testEngine
    .getCardInstanceIdsInZone(zone, playerId)
    .filter(
      (cardId) => testEngine.getCardDefinitionId(cardId) === definitionId,
    ) as CardInstanceId[];
}

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.5. Replacement Effects", () => {
    it("6.5.1.1. Stolen Scimitar gives +1 to a non-Aladdin and +2 instead to Aladdin.", () => {
      const aladdinEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          stolenScimitar,
          { card: aladdinHeroicOutlaw, isDrying: false },
          { card: flounderVoiceOfReason, isDrying: false },
        ],
      });

      expect(aladdinEngine.asPlayerOne().activateAbility(stolenScimitar)).toBeSuccessfulCommand();
      expect(aladdinEngine.asPlayerOne().respondWith(aladdinHeroicOutlaw)).toBeSuccessfulCommand();
      expect(aladdinEngine.asPlayerOne().getCardStrength(aladdinHeroicOutlaw)).toBe(
        aladdinHeroicOutlaw.strength + 2,
      );

      const nonAladdinEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stolenScimitar, { card: flounderVoiceOfReason, isDrying: false }],
      });

      expect(
        nonAladdinEngine.asPlayerOne().activateAbility(stolenScimitar),
      ).toBeSuccessfulCommand();
      expect(
        nonAladdinEngine.asPlayerOne().respondWith(flounderVoiceOfReason),
      ).toBeSuccessfulCommand();
      expect(nonAladdinEngine.asPlayerOne().getCardStrength(flounderVoiceOfReason)).toBe(
        flounderVoiceOfReason.strength + 1,
      );
    });

    it("6.5.2. Max Goof only replaces the replayed song's discard destination, not the rest of the event.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [heiheiBoatSnack],
        discard: [thisIsMyFamily],
        play: [maxGoofChartTopper],
      });

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [thisIsMyFamily],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.getCardDefinitionIdsInZone("hand", PLAYER_ONE)).toContain(
        heiheiBoatSnack.id,
      );
      expect(testEngine.getCardDefinitionIdsInZone("discard", PLAYER_ONE)).not.toContain(
        thisIsMyFamily.id,
      );
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toContain(
        thisIsMyFamily.id,
      );
    });

    it("6.5.3. Snuggly Duckling checks the replacement condition when the bag effect resolves.", () => {
      // Example: Snuggly Duckling - Disreputable Pub has an ability called Routine Ruckus that reads, "Whenever a character with 3 or more challenges another character while here, gain 1 lore. If the challenging character has 6 or more, gain 3 lore instead." When a character challenges another character while at this location, the triggered ability is added to the bag and resolves. On resolution, the replacement condition "If the challenging character has 6 or more" is checked to see if it's met. If the stated condition isn't met, the replacement effect doesn't happen, even if the stated condition would be true later in the challenge.
      const threeStrengthEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            snugglyDucklingDisreputablePub,
            {
              card: tongSurvivor,
              atLocation: snugglyDucklingDisreputablePub,
              isDrying: false,
            },
          ],
        },
        {
          play: [{ card: hadesMeticulousPlotter, exerted: true, isDrying: false }],
        },
      );

      expect(
        threeStrengthEngine.asPlayerOne().challenge(tongSurvivor, hadesMeticulousPlotter),
      ).toBeSuccessfulCommand();
      expect(threeStrengthEngine.getLore(PLAYER_ONE)).toBe(1);

      const sixStrengthEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            snugglyDucklingDisreputablePub,
            {
              card: sisuWiseFriend,
              atLocation: snugglyDucklingDisreputablePub,
              isDrying: false,
            },
          ],
        },
        {
          play: [{ card: hadesMeticulousPlotter, exerted: true, isDrying: false }],
        },
      );

      expect(
        sixStrengthEngine.asPlayerOne().challenge(sisuWiseFriend, hadesMeticulousPlotter).success,
      ).toBe(true);
      expect(sixStrengthEngine.getLore(PLAYER_ONE)).toBe(3);
    });

    it("6.5.4, 6.5.5, 6.5.6, and 6.5.7. Seven Dwarfs' Mine self-replaces first, then Beast redirects the modified damage event.", () => {
      // Example: The active player has a Seven Dwarfs' Mine in play, and the opposing player has a Beast - Selfless Protector and a Flounder - Voice of Reason in play. Seven Dwarfs' Mine has the ability Mountain Defense, which reads, "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead." Beast - Selfless Protector has the ability Shield Another, which reads, "If one of your other characters would be dealt damage, put that many damage counters on this character instead."
      // The active player then plays Sleepy - Sluggish Knight, a character with the Knight classification, and moves him to Seven Dwarfs' Mine. When the location's triggered ability resolves, the active player chooses to deal damage to Flounder, resulting in the following event: Deal 1 damage to Flounder - Voice of Reason. Replacement effects from Seven Dwarfs' Mine and Beast can apply to this effect. Flounder is being affected, so the opposing player follows the steps listed in sections 6.5.7.1 through 6.5.7.3. First, the opposing player checks whether there are any self-replacement effects. The Mine's effect "deal 2 damage instead" is a self-replacement effect that can apply, so the opposing player chooses and applies it. As a result, the modified event is: Deal 2 damage to Flounder - Voice of Reason.
      // The steps are repeated, and the opposing player checks for other self-replacement effects. Finding none, the opposing player moves to the next step and checks for any other replacement effects. Beast - Selfless Protector has a replacement effect that can apply, so the opposing player chooses and applies it, resulting in this event: Put 2 damage counters on Beast - Selfless Protector. The opposing player repeats the steps, but since no replacement effects can apply, the effect resolves and the game continues.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: [heiheiBoatSnack, flounderVoiceOfReason],
          play: [sevenDwarfsMineSecureFortress, { card: sleepySluggishKnight, isDrying: false }],
        },
        {
          play: [beastSelflessProtector, flounderVoiceOfReason],
        },
      );

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(sleepySluggishKnight, sevenDwarfsMineSecureFortress),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [flounderVoiceOfReason],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(beastSelflessProtector)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(flounderVoiceOfReason)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(flounderVoiceOfReason)).toBe("play");
    });

    it("6.5.8. Two identical Rapunzel prevention effects collapse to one application and both are gone after the first damage event.", () => {
      // Example: The active player has a Rapunzel – Ready for Adventure, a Flounder – Voice of Reason, and 2 copies of Heihei – Boat Snack in play. Rapunzel has a triggered ability called Act of Kindness that reads, “Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.” The active player quests with a Heihei and chooses to add his Ⓞ to Flounder’s Ⓞ with Support, causing Rapunzel’s triggered ability to occur. The ability is added to and resolves from the bag, creating a replacement effect: The next time Flounder would be dealt damage, he takes no damage instead. The active player quests with the other Heihei and chooses to add his Ⓞ to Flounder’s Ⓞ with Support. Rapunzel’s triggered ability is again added to and resolves from the bag, creating another instance of the same replacement effect.
      // The active player exerts Flounder to challenge an opposing exerted character. During the Challenge Damage step, damage is dealt to each character in the challenge, resulting in the following event: The challenged character deals damage equal to their \(\text{品}\) to Flounder. Flounder would be dealt damage, so the active player attempts to apply the two instances of the same replacement effect. Because two or more instances of the same replacement effect can't apply to the same event, the active player chooses one to apply, resulting in this event: The challenged opposing character deals no damage to Flounder. The remaining instance of the replacement effect can't apply and ceases to exist.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            rapunzelReadyForAdventure,
            heiheiBoatSnack,
            heiheiBoatSnack,
            flounderVoiceOfReason,
          ],
        },
        {
          play: [heiheiBoatSnack, heiheiBoatSnack],
        },
      );

      const supportingHeiheis = getInstancesByDefinitionId(
        testEngine,
        "play",
        PLAYER_ONE,
        heiheiBoatSnack.id,
      );

      for (const heiheiId of supportingHeiheis) {
        expect(testEngine.asPlayerOne().quest(heiheiId)).toBeSuccessfulCommand();
        expect(
          testEngine.asPlayerOne().resolveOnlyBag({
            resolveOptional: true,
            targets: [flounderVoiceOfReason],
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asServer().manualExertCard(flounderVoiceOfReason)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const attackingHeiheis = getInstancesByDefinitionId(
        testEngine,
        "play",
        PLAYER_TWO,
        heiheiBoatSnack.id,
      );

      expect(
        testEngine.asPlayerTwo().challenge(attackingHeiheis[0]!, flounderVoiceOfReason),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(flounderVoiceOfReason)).toBe(0);

      expect(
        testEngine.asPlayerTwo().challenge(attackingHeiheis[1]!, flounderVoiceOfReason),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(flounderVoiceOfReason)).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(flounderVoiceOfReason)).toBe("play");
    });
  });
});
