import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";
import { naveensUkulele } from "../../006/items/031-naveens-ukulele";
import { isabelaMadrigalPerfectlyInControl } from "./153-isabela-madrigal-perfectly-in-control";
import { isabelaMadrigalSuchALovelyVoice } from "./016-isabela-madrigal-such-a-lovely-voice";

const damagedAlly = createMockCharacter({
  id: "isabela-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

describe("Isabela Madrigal - Such a Lovely Voice", () => {
  it("has Singer 5 keyword", () => {
    const keyword = isabelaMadrigalSuchALovelyVoice.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Singer",
    );
    expect(keyword).toBeDefined();
    expect((keyword as { value?: number }).value).toBe(5);
  });

  describe("NEW MOTIF - When you play this character, if you removed 1 or more damage from one of your characters this turn, gain 1 lore.", () => {
    it("gains 1 lore when played after removing damage from one of your characters this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [isabelaMadrigalSuchALovelyVoice],
          play: [{ card: damagedAlly, damage: 3 }, magicGoldenFlower],
          inkwell: isabelaMadrigalSuchALovelyVoice.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Heal the damaged ally first, enabling NEW MOTIF's condition.
      expect(
        testEngine.asPlayerOne().activateAbility(magicGoldenFlower, {
          abilityIndex: 0,
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().playCard(isabelaMadrigalSuchALovelyVoice),
      ).toBeSuccessfulCommand();

      // Resolve any pending bag effect (auto-resolution may apply).
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalSuchALovelyVoice),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore when played without having removed damage this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [isabelaMadrigalSuchALovelyVoice],
          inkwell: isabelaMadrigalSuchALovelyVoice.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().playCard(isabelaMadrigalSuchALovelyVoice),
      ).toBeSuccessfulCommand();

      // Condition fails; resolve any queued bag effect, which should have no impact.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalSuchALovelyVoice),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });

  describe("Singer interaction with +N cost to sing songs (rule 8.11 — Wilds Unknown)", () => {
    // Per the Wilds Unknown 8.11 clarification, when a Singer character is
    // affected by a "counts as having +N cost to sing songs" modifier, the
    // higher of (Singer value, modified printed cost) governs which songs they
    // can sing. Isabela has Singer 5 (printed cost 3). With Naveen's Ukulele
    // adding +3, modified printed cost = 6. max(5, 6) = 6, so she should be
    // able to sing a cost-6 song but not a cost-7 song.

    const songCost6 = createMockSong({
      id: "isabela-singer-rule-song-6",
      name: "Cost Six Song",
      cost: 6,
      text: "Test song.",
    });

    const songCost7 = createMockSong({
      id: "isabela-singer-rule-song-7",
      name: "Cost Seven Song",
      cost: 7,
      text: "Test song.",
    });

    it("can sing a cost-6 song after +3 cost-to-sing modifier (max(Singer 5, 3+3) = 6)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: isabelaMadrigalSuchALovelyVoice, isDrying: false }, naveensUkulele],
        hand: [songCost6],
        inkwell: 1, // pay activation cost of Naveen's Ukulele
        deck: 3,
      });

      // Without ukulele, Singer 5 already enables cost-5 songs but not cost-6.
      // Apply +3 cost to sing — modified printed cost = 6, Singer = 5, max = 6.
      expect(
        testEngine.asPlayerOne().activateAbility(naveensUkulele, {
          targets: [isabelaMadrigalSuchALovelyVoice],
        }),
      ).toBeSuccessfulCommand();

      // Now Isabela should be able to sing the cost-6 song.
      expect(
        testEngine.asPlayerOne().singSong(songCost6, isabelaMadrigalSuchALovelyVoice),
      ).toBeSuccessfulCommand();
    });

    it("cannot sing a cost-7 song after +3 cost-to-sing modifier (max(5, 6) = 6 < 7)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: isabelaMadrigalSuchALovelyVoice, isDrying: false }, naveensUkulele],
        hand: [songCost7],
        inkwell: 1,
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(naveensUkulele, {
          targets: [isabelaMadrigalSuchALovelyVoice],
        }),
      ).toBeSuccessfulCommand();

      // Modified printed cost = 6, Singer = 5, max = 6 < 7 — must fail.
      expect(
        testEngine.asPlayerOne().singSong(songCost7, isabelaMadrigalSuchALovelyVoice),
      ).not.toBeSuccessfulCommand();
    });
  });

  describe("release notes ruling", () => {
    it("moving damage counts as removing damage — New Motif triggers if damage was moved earlier this turn", () => {
      // Use Isabela – Perfectly in Control's Feel Better (on-quest) to MOVE damage.
      // After moving damage from a damaged ally to Isabela-PIC, playing
      // Isabela – Such a Lovely Voice should still gain 1 lore from New Motif.
      const releaseDamagedAlly = createMockCharacter({
        id: "isabela-release-damaged-ally",
        name: "Damaged Ally",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [isabelaMadrigalSuchALovelyVoice],
          play: [
            { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
            { card: releaseDamagedAlly, damage: 3 },
          ],
          inkwell: isabelaMadrigalSuchALovelyVoice.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      // Quest with Isabela-PIC to MOVE all damage from releaseDamagedAlly to her.
      expect(
        testEngine.asPlayerOne().quest(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [releaseDamagedAlly] }),
      ).toBeSuccessfulCommand();

      // Verify damage was MOVED (not just removed): destination has the damage.
      expect(testEngine.asPlayerOne().getDamage(releaseDamagedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(3);

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      // Now play Isabela – Such a Lovely Voice; New Motif must trigger.
      expect(
        testEngine.asPlayerOne().playCard(isabelaMadrigalSuchALovelyVoice),
      ).toBeSuccessfulCommand();
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalSuchALovelyVoice),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });
});
