// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/04-turn-actions.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  cheshireCatNotAllThere,
  dinglehopper,
  marshmallowPersistentGuardian,
  simbaProtectiveCub,
  stitchNewDog,
  timonGrubRustler,
} from "@tcg/lorcana-cards/cards/001";
import {
  cursedMerfolkUrsulasHandiwork,
  deVilManorCruellasEstate,
  miloThatchCleverCartographer,
  neverLandMermaidLagoon,
} from "@tcg/lorcana-cards/cards/003";
import { goofySuperGoof, hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { rayaGuidanceSeeker } from "@tcg/lorcana-cards/cards/007";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { rafikiMysticalFighter, shenziHyenaPackLeader } from "@tcg/lorcana-cards/cards/009";

describe("#### 4. TURN ACTIONS", () => {
  describe("#### 4.6. Challenge", () => {
    it("4.6.1. Only characters can challenge. A character declared by a player to challenge is the challenging character. The player who declares a challenging character is the challenging player. The opposing character or location is being challenged, and the player whose character or location is being challenged is the challenged player.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [dinglehopper, hiddenCoveTranquilHaven],
          deck: 1,
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(dinglehopper, miloThatchCleverCartographer) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("ATTACKER_NOT_CHARACTER");

      const result2 = testEngine
        .asPlayerOne()
        .challenge(hiddenCoveTranquilHaven, miloThatchCleverCartographer) as CommandFailure;

      expect(result2.success).toBe(false);
      expect(result2.errorCode).toBe("ATTACKER_NOT_CHARACTER");
    });

    it("4.6.4.1. A character must have been in play at the beginning of the Set step of their player's turn and ready in order to challenge.", () => {
      const dryingEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: true }],
          deck: 1,
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
          deck: 1,
        },
      );

      const dryingResult = dryingEngine
        .asPlayerOne()
        .challenge(stitchNewDog, miloThatchCleverCartographer) as CommandFailure;
      expect(dryingResult.success).toBe(false);
      expect(dryingResult.errorCode).toBe("ATTACKER_DRYING");

      const exertedEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
          deck: 1,
        },
      );

      const exertedResult = exertedEngine
        .asPlayerOne()
        .challenge(stitchNewDog, miloThatchCleverCartographer) as CommandFailure;
      expect(exertedResult.success).toBe(false);
      expect(exertedResult.errorCode).toBe("ATTACKER_EXERTED");
    });

    it("4.6.4.2. The player chooses an exerted opposing character to be challenged.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: 1,
        },
        {
          play: [miloThatchCleverCartographer],
          deck: 1,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(stitchNewDog, miloThatchCleverCartographer) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("DEFENDER_CHARACTER_NOT_EXERTED");
    });

    it("4.6.4.3. The players check for challenging restrictions.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: simbaProtectiveCub, exerted: true },
            { card: miloThatchCleverCartographer, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(stitchNewDog, miloThatchCleverCartographer) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
    });

    it("4.6.4.4. The challenging player exerts the challenging character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: rayaGuidanceSeeker, exerted: true },
            { card: timonGrubRustler, exerted: true },
          ],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(stitchNewDog, rayaGuidanceSeeker).success).toBe(
        true,
      );

      expect(testEngine.getCard(stitchNewDog).exerted).toBe(true);

      const result = testEngine
        .asPlayerOne()
        .challenge(stitchNewDog, timonGrubRustler) as CommandFailure;
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("ATTACKER_EXERTED");
    });

    it("4.6.5. Challenge-declaration triggered abilities resolve before the challenge moves to the Challenge Damage step.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofySuperGoof],
          deck: 1,
        },
        {
          play: [{ card: timonGrubRustler, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(goofySuperGoof, timonGrubRustler).success).toBe(
        true,
      );
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(timonGrubRustler)).toBe("discard");
    });

    it("4.6.6.3. After challenge damage is dealt, a game state check occurs.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [stitchNewDog],
          deck: 1,
        },
        {
          play: [{ card: timonGrubRustler, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, timonGrubRustler),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(timonGrubRustler)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(stitchNewDog)).toBe("play");
    });

    it("4.6.8.2. Locations aren't considered ready or exerted and can be challenged at any time during the Main Phase.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: 1,
        },
        {
          play: [deVilManorCruellasEstate],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, deVilManorCruellasEstate).success,
      ).toBe(true);
    });

    it("4.6.8.3. Locations don't deal damage to the challenging character during the Challenge Damage step.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [stitchNewDog],
          deck: 1,
        },
        {
          play: [deVilManorCruellasEstate],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, deVilManorCruellasEstate).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCard(stitchNewDog).damage).toBe(0);
      expect(testEngine.asPlayerOne().getCard(deVilManorCruellasEstate).damage).toBe(
        stitchNewDog.strength,
      );
      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("play");
    });

    it("4.6.9.1. If a character in a challenge is removed from the challenge, remaining triggered abilities in the bag resolve before the challenge ends.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arielOnHumanLegs],
          play: [goofySuperGoof],
          deck: 1,
        },
        {
          play: [{ card: cursedMerfolkUrsulasHandiwork, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(goofySuperGoof, cursedMerfolkUrsulasHandiwork).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(bagEffect!.sourceId),
      ).toBeSuccessfulCommand();

      const arielId = testEngine.findCardInstanceId(arielOnHumanLegs, "hand");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [arielId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    describe("Examples", () => {
      it("4.6 Example A. Stitch - New Dog and Milo Thatch - Clever Cartographer deal damage equal to their Strength to each other.", () => {
        // Example A: The active player has a ready Stitch – New Dog in play, and an opponent has an exerted Milo Thatch – Clever Cartographer in play. The active player announces Stitch is challenging and chooses Milo Thatch as the character being challenged. There are no restrictions or requirements to satisfy. The active player exerts Stitch. No effects trigger as a result of these declarations. Stitch and Milo Thatch deal damage equal to their Strength {S} to each other. The active player and the opponent each place damage counters on their character. A game state check is performed and no effects trigger from the check. The challenge is over.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [stitchNewDog],
            deck: 1,
          },
          {
            play: [{ card: miloThatchCleverCartographer, exerted: true }],
            deck: 1,
          },
        );

        expect(
          testEngine.asPlayerOne().challenge(stitchNewDog, miloThatchCleverCartographer).success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().getCardZone(stitchNewDog)).toBe("discard");
        expect(testEngine.asPlayerOne().getCardZone(miloThatchCleverCartographer)).toBe("discard");
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      });

      it("4.6 Example B.", () => {
        // Example B: The active player declares Marshmallow – Persistent Guardian is challenging an opposing Cheshire Cat – Not All There. Cheshire Cat’s ability Lose Something? reads, “When this character is challenged and banished, banish the challenging character.” Marshmallow’s ability Durable reads, “When this character is banished in a challenge, you may return this card to your hand.” Marshmallow has 5 {S}, so he deals 5 damage to Cheshire Cat, who has 3 {W}. When the game state check is made, Cheshire Cat is banished. This triggers his ability, and the opponent adds it to the bag. The opponent resolves the ability’s effect, banishing Marshmallow. Because the players haven’t reached the step of the challenge in which effects in the bag are resolved, they’re still in the challenge, and the active player adds Marshmallow’s ability to the bag. The active player can then resolve it, returning Marshmallow to their hand. There are no more effects to add, and the bag is empty. The challenge is over.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [marshmallowPersistentGuardian],
            deck: 1,
          },
          {
            play: [{ card: cheshireCatNotAllThere, exerted: true }],
            deck: 1,
          },
        );

        expect(
          testEngine.asPlayerOne().challenge(marshmallowPersistentGuardian, cheshireCatNotAllThere)
            .success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().getCardZone(cheshireCatNotAllThere)).toBe("discard");
        // Cheshire Cat’s ability is in the bag, PLAYER_TWO should have the priority
        expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
        expect(testEngine.asPlayerOne().getActivePlayer()).toBe(PLAYER_TWO);
        expect(testEngine.asPlayerOne().getCurrentPhase()).toBe("main");
        expect(testEngine.asPlayerOne().getCurrentStep()).toBe("challengeDamage");

        // player two resolves the bag, targeting marshmallowPersistentGuardian
        expect(
          testEngine
            .asPlayerTwo()
            .resolvePendingByCard(testEngine.asPlayerTwo().getBagEffects()[0]!.sourceId).success,
        ).toBe(true);

        // Marshmallow’s ability is in the bag, PLAYER_ONE should have the priority
        expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
        expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
        expect(testEngine.asPlayerOne().getActivePlayer()).toBe(PLAYER_ONE);
        expect(testEngine.asPlayerOne().getCurrentStep()).toBe("challengeDamage");

        // player one resolves the bag, moving marshmallow to hand
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
              resolveOptional: true,
            }).success,
        ).toBe(true);
        expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("hand");

        // challenge is over, the step is back to empty
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(testEngine.asPlayerOne().getCurrentStep()).toBe("");
      });

      it("4.6 Example C.", () => {
        // Example C: The active player declares Rafiki – Mystical Fighter is challenging an opposing Shenzi – Hyena Pack Leader, who has \(_ { 0 \sim }\) and is at De Vil Manor – Cruella’s Estate. De Vil Manor has no abilities, but Shenzi’s ability I’ll Handle This gives her \(+ 3 0\) while she’s at a location. Rafiki’s ability Ancient Skills reads, “Whenever he challenges a Hyena character, this character takes no damage from the challenge.” After restrictions and requirements are checked and Rafiki is exerted, the active player adds this triggered ability to the bag. The active player then resolves that effect. When the challenge proceeds to the Challenge Damage step, Rafiki won’t be dealt any damage.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [rafikiMysticalFighter],
            deck: 1,
          },
          {
            play: [
              deVilManorCruellasEstate,
              { card: shenziHyenaPackLeader, exerted: true, atLocation: deVilManorCruellasEstate },
            ],
            deck: 1,
          },
        );

        expect(
          testEngine.asPlayerOne().challenge(rafikiMysticalFighter, shenziHyenaPackLeader).success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(testEngine.asPlayerOne().getCurrentStep()).toBe("");

        // Rafiki has Challenger +3, so Shenzi should take 3 damage.
        expect(testEngine.asPlayerOne().getCard(shenziHyenaPackLeader).damage).toBe(3);
        expect(testEngine.asPlayerOne().getCard(rafikiMysticalFighter).damage).toBe(0);
        expect(testEngine.asPlayerOne().getCardZone(shenziHyenaPackLeader)).toBe("play");
        expect(testEngine.asPlayerOne().getCardZone(rafikiMysticalFighter)).toBe("play");
      });
    });
  });
});
