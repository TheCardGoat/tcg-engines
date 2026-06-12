import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";

/**
 * TRIGGERED ABILITIES ON PUT-CARD-UNDER
 * Tests for abilities triggered when a card is placed under a character or location
 */
describe("Triggered Abilities on Put-Card-Under", () => {
  describe("LJ-001 to LJ-005: Little John - READY TO RASSLE (Self-Referential)", () => {
    it.todo("LJ-001: Readies self when card put under via Boost", () => {});

    it.todo("LJ-002: Readies self when card put under via other means", () => {});

    it.todo("LJ-003: Effect is optional", () => {});

    it.todo("LJ-004: Works even if already ready", () => {});

    it.todo("LJ-005: Can challenge again after Boost + Ready combo", () => {});
  });

  describe("SCAR-001 to SCAR-005: Scar - SURVIVAL OF THE FITTEST", () => {
    it.todo("SCAR-001: Gives -5 strength to chosen opposing character", () => {});

    it.todo("SCAR-002: Modifier lasts this turn", () => {});

    it.todo("SCAR-003: Triggers on Boost put-under", () => {});

    it.todo("SCAR-004: Triggers on other put-under sources", () => {});

    it.todo("SCAR-005: Can target different characters on multiple triggers", () => {});
  });

  describe("SIMBA-001 to SIMBA-006: Simba - TIMELY ALLIANCE", () => {
    it.todo("SIMBA-001: Reveal top card when card put under", () => {});

    it.todo("SIMBA-002: If character: may play for free exerted", () => {});

    it.todo("SIMBA-003: If NOT character: put on bottom of deck", () => {});

    it.todo("SIMBA-004: Effect is optional", () => {});

    it.todo("SIMBA-005: Works with Boost put-under", () => {});

    it.todo("SIMBA-006: Works with other put-under sources", () => {});
  });

  describe("CHESHIRE-001 to CHESHIRE-004: Cheshire Cat - IT'S LOADS OF FUN", () => {
    it.todo("CHESHIRE-001: Move up to 2 damage from chosen to opposing", () => {});

    it.todo("CHESHIRE-002: Effect is optional", () => {});

    it.todo("CHESHIRE-003: Can choose any character as source", () => {});

    it.todo("CHESHIRE-004: Can move less than 2 damage", () => {});
  });

  describe("FG-001 to FG-006: Fairy Godmother - STUNNING TRANSFORMATION", () => {
    it.todo("FG-001: May banish chosen opposing character", () => {});

    it.todo("FG-002: If banish: opponent reveals top card", () => {});

    it.todo("FG-003: If character/item: opponent may play for free", () => {});

    it.todo("FG-004: Otherwise: put on bottom of opponent's deck", () => {});

    it.todo("FG-005: Effect is optional", () => {});

    it.todo("FG-006: 'If you do' chain - no banish = no reveal/play", () => {});
  });

  describe("JIMINY-001 to JIMINY-003: Jiminy Cricket - LOOK INTO YOUR PAST", () => {
    it.todo("JIMINY-001: Put card from discard to inkwell facedown exerted", () => {});

    it.todo("JIMINY-002: Effect is optional", () => {});

    it.todo("JIMINY-003: Cannot activate if discard is empty", () => {});
  });

  describe("WEBBY-001 to WEBBY-005: Webby's Diary - LATEST ENTRY (Broad Trigger)", () => {
    it.todo("WEBBY-001: May pay 1 ink to draw when card put under YOUR char/loc", () => {});

    it.todo("WEBBY-002: Effect is optional", () => {});

    it.todo("WEBBY-003: Cannot activate without ink", () => {});

    it.todo("WEBBY-004: Does NOT trigger on opponent's put-under", () => {});

    it.todo("WEBBY-005: Works for Boost and non-Boost sources", () => {});
  });

  describe("ARES-001 to ARES-005: Ares - CALL TO BATTLE", () => {
    it.todo("ARES-001: May ready chosen character", () => {});

    it.todo("ARES-002: Readied character can't quest this turn", () => {});

    it.todo("ARES-003: Once per turn restriction", () => {});

    it.todo("ARES-004: Does NOT count across turns", () => {});

    it.todo("ARES-005: Works with Reckless (doesn't conflict)", () => {});
  });

  describe("MAGICA-001 to MAGICA-003: Magica De Spell - MYSTICAL MANIPULATION", () => {
    it.todo("MAGICA-001: Move 1 damage from chosen to opposing", () => {});

    it.todo("MAGICA-002: Effect is optional", () => {});

    it.todo("MAGICA-003: Works on any put-under source", () => {});
  });

  describe("TAMATOA-001 to TAMATOA-004: Tamatoa - ANYTHING THAT GLITTERS", () => {
    it.todo("TAMATOA-001: Gets +1 lore this turn when card put under ANY of your chars/locs", () => {});

    it.todo("TAMATOA-002: Stacks with multiple put-unders", () => {});

    it.todo("TAMATOA-003: Bonus expires at end of turn", () => {});

    it.todo("TAMATOA-004: Triggers on Boost used on OTHER characters", () => {});
  });

  describe("MORTY-001 to MORTY-005: Morty Fieldmouse - HOLIDAY SPIRIT", () => {
    it.todo("MORTY-001: Puts card under SELF when card put under OTHER your character", () => {});

    it.todo("MORTY-002: Once per turn restriction", () => {});

    it.todo("MORTY-003: Only during YOUR turn", () => {});

    it.todo("MORTY-004: Does NOT trigger when card put under self", () => {});

    it.todo("MORTY-005: Does NOT trigger on opponent's turn", () => {});
  });
});
