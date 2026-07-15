import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-types";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  johnSilverAlienPirate,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  simbaProtectiveCub,
  stealFromTheRich,
  stitchCarefreeSurfer,
} from "@tcg/lorcana-cards/cards/001";
import { scarViciousCheater } from "@tcg/lorcana-cards/cards/002";
import { candyDrift } from "@tcg/lorcana-cards/cards/008";

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.2. Triggered Abilities", () => {
    it("6.2.1. / 6.2.2. / 6.2.3. / 6.2.4. Stitch's play trigger adds one bag entry and checks its secondary if only on resolution.", () => {
      // Example: Stitch - Carefree Surfer has an ability called Ohana that reads, "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards." When the active player plays Stitch, the triggered ability is added to the bag. When chosen to resolve, the effect checks if the player has two or more characters in play. If they don't, the triggered ability resolves with no effect.
      const noDrawEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stitchCarefreeSurfer],
        inkwell: stitchCarefreeSurfer.cost,
        deck: 2,
        play: [simbaProtectiveCub, minnieMouseAlwaysClassy],
      });

      expect(noDrawEngine.asPlayerOne().playCard(stitchCarefreeSurfer)).toBeSuccessfulCommand();
      expect(noDrawEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(noDrawEngine.asPlayerOne().getBagEffects()).toHaveLength(1);
      expect(noDrawEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      // Remove one character so the Ohana condition (2+ other chars) no longer holds.
      // The 6.2.7 optimization auto-resolves the bag entry immediately (no player input needed)
      // because bagEffectNeedsPlayerDecision() returns false when the condition has already failed.
      const minnieId = noDrawEngine.findCardInstanceId(minnieMouseAlwaysClassy, "play", PLAYER_ONE);
      expect(
        noDrawEngine.asServer().manualMoveCard(minnieId, `discard:${PLAYER_ONE}` as ZoneId).success,
      ).toBe(true);
      expect(noDrawEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(noDrawEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    // it("6.2.4.1. Stitch's play trigger DOES add a bag entry even if condition is not met at trigger time; condition is checked at resolution.", () => {
    // The correct is to add the trigger to the bag, but to improve UX we're skipping it. As adding a single trigger that we know it fails will result in an additional click.
    // When multiple triggers are being added, we must not skip as the resolution order may influence.
    it("6.2.4.1. Stitch's play trigger does NOT add a bag entry when its board-state condition is not met at trigger time.", () => {
      const noTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stitchCarefreeSurfer],
        inkwell: stitchCarefreeSurfer.cost,
        deck: 2,
        play: [simbaProtectiveCub],
      });

      expect(noTriggerEngine.asPlayerOne().playCard(stitchCarefreeSurfer)).toBeSuccessfulCommand();
      expect(noTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(noTriggerEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
      expect(noTriggerEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    it("6.2.5. Scar's two sentences share one challenge-banish trigger, and without that trigger he can still quest normally.", () => {
      // Example: Scar – Vicious Cheater has an ability called Daddy Isn't Here to Save You that reads, “During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.” Because the two effects are both linked to the trigger condition, if Scar doesn't banish another character in a challenge, he can quest this turn as normal.
      const triggeredEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scarViciousCheater],
          deck: 1,
        },
        {
          play: [{ card: simbaProtectiveCub, exerted: true }],
          deck: 1,
        },
      );

      expect(
        triggeredEngine.asPlayerOne().challenge(scarViciousCheater, simbaProtectiveCub),
      ).toBeSuccessfulCommand();
      expect(triggeredEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
      expect(triggeredEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        triggeredEngine
          .asPlayerOne()
          .resolvePendingByCard(triggeredEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
          }),
      ).toBeSuccessfulCommand();
      expect(triggeredEngine.asPlayerOne().isExerted(scarViciousCheater)).toBe(false);
      expect(triggeredEngine.asPlayerOne().getCard(scarViciousCheater)?.hasQuestRestriction).toBe(
        true,
      );
      expect(triggeredEngine.asPlayerOne().quest(scarViciousCheater).success).toBe(false);

      const noTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scarViciousCheater],
        deck: 1,
      });

      expect(noTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(noTriggerEngine.asPlayerOne().getCard(scarViciousCheater)?.hasQuestRestriction).toBe(
        false,
      );
      expect(noTriggerEngine.asPlayerOne().quest(scarViciousCheater)).toBeSuccessfulCommand();
      expect(noTriggerEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(scarViciousCheater.lore);
    });

    it("6.2.6. John Silver's play and quest trigger conditions each work on their own for the same Reckless effect.", () => {
      // Example: John Silver - Alien Pirate has an ability called Pick Your Fights that reads, "When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn." The triggered ability occurs when John Silver is played and also when the active player quests with this character. The triggered ability doesn't require both trigger conditions to be true at the same time for it to occur, only one or the other.
      const playTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverAlienPirate],
          inkwell: johnSilverAlienPirate.cost,
          deck: 3,
        },
        {
          play: [simbaProtectiveCub],
          deck: 3,
        },
      );
      const simbaId = playTriggerEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(
        playTriggerEngine.asPlayerOne().playCard(johnSilverAlienPirate),
      ).toBeSuccessfulCommand();
      expect(playTriggerEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);
      expect(
        playTriggerEngine
          .asPlayerOne()
          .resolvePendingByCard(playTriggerEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [simbaId],
          }),
      ).toBeSuccessfulCommand();
      expect(playTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

      expect(playTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(true);
      expect(
        playTriggerEngine.executeMoveForView("authoritative", "manualPassTurn", {
          args: {},
        }),
      ).toBeSuccessfulCommand();
      expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

      const questTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSilverAlienPirate],
          deck: 3,
        },
        {
          play: [simbaProtectiveCub],
          deck: 3,
        },
      );
      const laterSimbaId = questTriggerEngine.findCardInstanceId(
        simbaProtectiveCub,
        "play",
        PLAYER_TWO,
      );

      expect(questTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerOne().quest(johnSilverAlienPirate)).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        questTriggerEngine
          .asPlayerOne()
          .resolvePendingByCard(questTriggerEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [laterSimbaId],
          }),
      ).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(questTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

      expect(questTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(true);
      expect(
        questTriggerEngine.executeMoveForView("authoritative", "manualPassTurn", {
          args: {},
        }),
      ).toBeSuccessfulCommand();
      expect(questTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);
    });

    it("6.2.7. / 6.2.7.1. Steal from the Rich creates a floating trigger outside the bag until end of turn.", () => {
      // Example: Steal from the Rich is an action that reads, "Whenever one of your characters quests this turn, each opponent loses 1 lore." When Steal from the Rich resolves, it creates the floating triggered ability defined by the card. This exists for the rest of the turn. Whenever the player quests with one of their characters that turn, the condition of the floating triggered ability is met and an instance of that triggered ability is added to the bag to resolve. The floating triggered ability continues to exist outside of the bag until the end of the turn, when the specified duration in the condition expires.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        play: [simbaProtectiveCub, minnieMouseAlwaysClassy],
        deck: 3,
      });

      testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

      expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(4);

      expect(testEngine.asPlayerOne().quest(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(3);
    });

    it("6.2.7.2. Candy Drift creates a delayed trigger registration that enters the bag only at end of turn.", () => {
      // Example: Candy Drift is an action that reads, "Draw a card. Chosen character of yours gets \(+5\) this turn. At the end of your turn, banish them." When the action resolves, it generates a delayed triggered ability: "At the end of your turn, banish them." The triggered ability exists outside of the bag until the step of the End-of-Turn Phase where end-of-turn triggered abilities occur (see 3.4.1.1). At that point, the triggered ability is added to the bag and resolves.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [candyDrift],
        inkwell: candyDrift.cost,
        play: [simbaProtectiveCub],
        deck: [mickeyMouseTrueFriend, minnieMouseAlwaysClassy],
      });

      expect(
        testEngine.asPlayerOne().playCard(candyDrift, { targets: [simbaProtectiveCub] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    });
  });
});
