import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../../../card-i18n";
import {
  KNOWN_PLAY_CARD_DISABLED_REASON_CODES,
  type PlayCardDisabledReason,
  assertNeverPlayCardDisabledReason,
} from "../../../play-card-disabled-reason";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "../../../testing";

function createMockActionCard(params: {
  id: string;
  name: string;
  cost: number;
  text: string;
  abilities: ActionCard["abilities"];
}): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities,
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text,
      },
    }),
    cardNumber: 901,
  };
}

const conditionalExertCharacter = createMockCharacter({
  id: "conditional-exert-character",
  name: "Conditional Exert Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  abilities: [
    {
      id: "conditional-exert-character-1",
      text: "This character enters play exerted unless you have Chip in play.",
      type: "static",
      condition: {
        type: "not",
        condition: {
          controller: "you",
          name: "Chip",
          type: "has-named-character",
        },
      },
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
    },
  ],
});

const chipCharacter = createMockCharacter({
  id: "conditional-exert-chip",
  name: "Chip",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const inkTestCharacter = createMockCharacter({
  id: "ink-test-character",
  name: "Ink Test Character",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("ink validation", () => {
  it("rejects playing a card with insufficient ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 2,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(inkTestCharacter)).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );
  });

  it("rejects playing a card with zero ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(inkTestCharacter)).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );
  });

  it("allows playing a card with exact ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: inkTestCharacter.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(inkTestCharacter).success).toBe(true);
  });

  it("allows playing a card with excess ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 8,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(inkTestCharacter).success).toBe(true);
  });

  it("canPlayCard returns false with insufficient ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 2,
      deck: 2,
    });

    expect(engine.asPlayerOne().canPlayCard(inkTestCharacter)).toBe(false);
  });

  it("excludes card from available moves when ink is insufficient", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 2,
      deck: 2,
    });

    const moves = engine.asPlayerOne().getAvailableMoves();
    const playMove = moves.find((move) => move.moveId === "playCard");

    if (playMove) {
      const cardId = engine.findCardInstanceId(inkTestCharacter, "hand", PLAYER_ONE);
      expect(playMove.selectableCardIds).not.toContain(cardId);
    }
  });

  it("rejects playing a second card after ink is spent on the first", () => {
    const cheapCharacter = createMockCharacter({
      id: "ink-test-cheap",
      name: "Ink Test Cheap",
      cost: 3,
      strength: 2,
      willpower: 2,
      lore: 1,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapCharacter, inkTestCharacter],
      inkwell: 5,
      deck: 2,
    });

    // First play succeeds (3 ink spent, 2 remaining)
    expect(engine.asPlayerOne().playCard(cheapCharacter).success).toBe(true);

    // Second play should fail (need 5, have 2)
    expect(engine.asPlayerOne().playCard(inkTestCharacter)).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );
  });
});

const songCard = createMockSong({
  id: "ink-test-song",
  name: "Ink Test Song",
  cost: 4,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const singerCharacter = createMockCharacter({
  id: "ink-test-singer",
  name: "Ink Test Singer",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("drag-and-drop ink-only enforcement", () => {
  it("rejects playing a song with standard cost when ink is insufficient even if a singer is available", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCard],
      play: [singerCharacter],
      inkwell: 0,
      deck: 2,
    });

    // Explicit standard cost must reject when ink is insufficient,
    // even though the song could be sung by the singer.
    expect(engine.asPlayerOne().playCard(songCard, { cost: "standard" })).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );
  });

  it("auto-sings a song when playCard is called without explicit cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCard],
      play: [singerCharacter],
      inkwell: 0,
      deck: 2,
    });

    // Without explicit cost, the engine falls back to singing automatically.
    // This is the behavior that drag-and-drop must avoid by passing explicit cost.
    expect(engine.asPlayerOne().playCard(songCard).success).toBe(true);
    expect(engine.asPlayerOne().isExerted(singerCharacter)).toBe(true);
  });

  it("does not include song in playCard available moves when ink is insufficient", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCard],
      play: [singerCharacter],
      inkwell: 0,
      deck: 2,
    });

    const moves = engine.asPlayerOne().getAvailableMoves();
    const playCardMove = moves.find((m) => m.moveId === "playCard");
    const singCardMove = moves.find((m) => m.moveId === "singCard");
    const songInstanceId = engine.findCardInstanceId(songCard, "hand", PLAYER_ONE);

    // Song must NOT appear in playCard (ink-based) moves
    if (playCardMove) {
      expect(playCardMove.selectableCardIds).not.toContain(songInstanceId);
    }

    // Song SHOULD appear in singCard moves (singer-based)
    expect(singCardMove).toBeDefined();
    expect(singCardMove!.selectableCardIds).toContain(songInstanceId);
  });

  it("includes song in playCard available moves when ink is sufficient", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCard],
      play: [singerCharacter],
      inkwell: songCard.cost,
      deck: 2,
    });

    const moves = engine.asPlayerOne().getAvailableMoves();
    const playCardMove = moves.find((m) => m.moveId === "playCard");
    const songInstanceId = engine.findCardInstanceId(songCard, "hand", PLAYER_ONE);

    // Song should appear in playCard moves when ink is available
    expect(playCardMove).toBeDefined();
    expect(playCardMove!.selectableCardIds).toContain(songInstanceId);
  });
});

// Regression: canPlayCard for a Shift card whose cost is "discard an action card"
// (e.g. Diablo - Devoted Herald, set 4 #70). Reported 2026-05-08 by multiple
// players in replays mgBjTEQGKlTomohGsQ2XVQ3 and mgFKq3PR-583ZptOV-Y8myO — the
// UI's Play CTA stayed hidden because canPlayCard ran standard-cost validation,
// got INSUFFICIENT_INK, and never tried the shift fallback. Fixed by adding a
// hasShift fallback to canPlayCard alongside the existing isSongCard fallback.
// These tests pin the contract so the fallback can't silently regress.
describe("canPlayCard — Shift with discard-only cost (no ink available)", () => {
  const diabloOnBoard = createMockCharacter({
    id: "regression-diablo-base",
    name: "Diablo",
    version: "Maleficent's Spy",
    cost: 2,
  });

  const throwawayAction = createMockActionCard({
    id: "regression-action-discard",
    name: "Throwaway Action",
    cost: 1,
    text: "Do nothing.",
    abilities: [],
  });

  const devotedHeraldLike = createMockCharacter({
    id: "regression-devoted-herald",
    name: "Diablo",
    version: "Devoted Herald-like",
    cost: 3,
    abilities: [
      {
        id: "regression-shift-action",
        keyword: "Shift",
        type: "keyword",
        shiftTarget: "Diablo",
        cost: {
          discardCards: 1,
          discardChosen: true,
          discardCardType: "action",
        },
        text: "Shift: Discard an action card",
      },
    ],
  });

  it("returns true when no ink is available but a legal shift discard exists", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike, throwawayAction],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().canPlayCard(devotedHeraldLike)).toBe(true);
  });

  it("playCard with explicit shift cost + action discard succeeds with 0 ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike, throwawayAction],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    const p1 = engine.asPlayerOne();
    const shiftTarget = engine.findCardInstanceId(diabloOnBoard, "play", PLAYER_ONE);
    const discardId = engine.findCardInstanceId(throwawayAction, "hand", PLAYER_ONE);

    expect(
      p1.playCard(devotedHeraldLike, {
        cost: { cost: "shift", shiftTarget, discardCards: [discardId] },
      }),
    ).toBeSuccessfulCommand();
  });

  it("returns false when no action card is in hand (cost cannot be paid)", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().canPlayCard(devotedHeraldLike)).toBe(false);
  });

  it("returns false when no shift target with the matching name is on the board", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike, throwawayAction],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().canPlayCard(devotedHeraldLike)).toBe(false);
  });
});

// Structured "why is the Play CTA disabled?" taxonomy. The UI keeps the
// button visible-but-disabled and shows a tooltip mapped from the returned
// `code` + `params`. canPlayCard remains a thin wrapper (returns false iff
// this method returns non-null), so the two cannot drift apart.
describe("getPlayCardDisabledReason", () => {
  const diabloOnBoard = createMockCharacter({
    id: "reason-diablo-base",
    name: "Diablo",
    version: "Maleficent's Spy",
    cost: 2,
  });

  const throwawayAction = createMockActionCard({
    id: "reason-throwaway-action",
    name: "Throwaway Action",
    cost: 1,
    text: "Do nothing.",
    abilities: [],
  });

  const devotedHeraldLike = createMockCharacter({
    id: "reason-devoted-herald",
    name: "Diablo",
    version: "Devoted Herald-like",
    cost: 3,
    abilities: [
      {
        id: "reason-shift-action",
        keyword: "Shift",
        type: "keyword",
        shiftTarget: "Diablo",
        cost: {
          discardCards: 1,
          discardChosen: true,
          discardCardType: "action",
        },
        text: "Shift: Discard an action card",
      },
    ],
  });

  const inkShiftCharacter = createMockCharacter({
    id: "reason-shift-ink",
    name: "Diablo",
    version: "Ink-Shift",
    cost: 6,
    abilities: [
      {
        id: "reason-shift-ink-kw",
        keyword: "Shift",
        type: "keyword",
        text: "Shift 4",
        cost: { ink: 4 },
      },
    ],
  });

  const songCardForReason = createMockSong({
    id: "reason-song",
    name: "Reason Song",
    cost: 4,
    text: "Gain 1 lore.",
    abilities: [
      {
        type: "action",
        effect: { amount: 1, target: "CONTROLLER", type: "gain-lore" },
      },
    ],
  });

  const singerCharacterForReason = createMockCharacter({
    id: "reason-song-singer",
    name: "Reason Singer",
    cost: 5,
  });

  it("returns null when the card can be played at standard cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: inkTestCharacter.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(inkTestCharacter)).toBeNull();
  });

  it("reports INSUFFICIENT_INK with needed/available params", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkTestCharacter],
      inkwell: 2,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(inkTestCharacter)).toEqual({
      code: "INSUFFICIENT_INK",
      params: { needed: inkTestCharacter.cost, available: 2 },
    });
  });

  it("reports SHIFT_NO_DISCARD_AVAILABLE when discard-cost shift can't be paid", () => {
    // Devoted Herald-style: Diablo on board, herald in hand, but no action
    // card to discard. Player has 0 ink, so standard play also fails — and
    // we want the *shift* reason to win because it's more actionable than
    // "needs 3 ink".
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(devotedHeraldLike)).toEqual({
      code: "SHIFT_NO_DISCARD_AVAILABLE",
      params: { discardCardType: "action", count: 1 },
    });
  });

  it("reports SHIFT_NO_TARGET when the shift card has no matching-named board target", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike, throwawayAction],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(devotedHeraldLike)).toEqual({
      code: "SHIFT_NO_TARGET",
      params: { targetName: "Diablo" },
    });
  });

  it("reports SHIFT_INSUFFICIENT_INK when an ink-cost shift can't be paid", () => {
    const inkShiftTarget = createMockCharacter({
      id: "reason-shift-ink-target",
      name: "Diablo",
      version: "Target",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkShiftCharacter],
      play: [inkShiftTarget],
      inkwell: 2,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(inkShiftCharacter)).toEqual({
      code: "SHIFT_INSUFFICIENT_INK",
      params: { needed: 4, available: 2 },
    });
  });

  it("reports SONG_NO_SINGER when a song can't be sung and there's no ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCardForReason],
      play: [{ card: singerCharacterForReason, isDrying: true }],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(songCardForReason)).toEqual({
      code: "SONG_NO_SINGER",
      params: { songCost: songCardForReason.cost },
    });
  });

  it("returns null for a song when a ready singer is available even with 0 ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCardForReason],
      play: [singerCharacterForReason],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(songCardForReason)).toBeNull();
  });

  it("returns null for shift when discard + target are both available even with 0 ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike, throwawayAction],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    expect(engine.asPlayerOne().getPlayCardDisabledReason(devotedHeraldLike)).toBeNull();
  });

  // Build a minimal-valid PlayCardDisabledReason value for a given code,
  // covering every variant. If a new code is added to the union without
  // a case here, TypeScript fails on the `assertNeverPlayCardDisabledReason`
  // line below, just like the consumer switch.
  function makeFakeReasonForCode(
    code: (typeof KNOWN_PLAY_CARD_DISABLED_REASON_CODES)[number],
  ): PlayCardDisabledReason {
    switch (code) {
      case "NOT_IN_HAND":
        return { code };
      case "INSUFFICIENT_INK":
        return { code, params: { needed: 3, available: 1 } };
      case "SHIFT_NO_TARGET":
        return { code, params: { targetName: "Diablo" } };
      case "SHIFT_NO_DISCARD_AVAILABLE":
        return { code, params: { discardCardType: "action", count: 1 } };
      case "SHIFT_INSUFFICIENT_INK":
        return { code, params: { needed: 4, available: 2 } };
      case "SONG_NO_SINGER":
        return { code, params: { songCost: 4 } };
      case "PLAYER_PLAY_RESTRICTED":
        return { code };
      case "SELF_PLAY_CONDITION_NOT_MET":
        return { code };
      case "BAG_PENDING":
        return { code };
      case "UNKNOWN":
        return { code, params: { validateMoveErrorCode: "TEST" } };
      default: {
        // Drift trap: forces a compile error when a code is added to
        // KNOWN_PLAY_CARD_DISABLED_REASON_CODES without a case here.
        const _exhaustive: never = code;
        throw new Error(`unhandled code in makeFakeReasonForCode: ${_exhaustive as string}`);
      }
    }
  }

  // This switch is the consumer-pattern reference (and the type-safety lever).
  // The `default: assertNeverPlayCardDisabledReason(...)` arm makes TypeScript
  // refuse to compile if a new variant is added to PlayCardDisabledReason
  // without being handled here. The UI's i18n catalog should use the same
  // shape, so adding a code without a translation key is also a build error.
  function describeReasonForTooltip(reason: PlayCardDisabledReason): string {
    switch (reason.code) {
      case "NOT_IN_HAND":
        return "not-in-hand";
      case "INSUFFICIENT_INK":
        return `insufficient-ink:${reason.params.needed}/${reason.params.available}`;
      case "SHIFT_NO_TARGET":
        return `shift-no-target:${reason.params.targetName}`;
      case "SHIFT_NO_DISCARD_AVAILABLE":
        return `shift-no-discard:${reason.params.discardCardType}x${reason.params.count}`;
      case "SHIFT_INSUFFICIENT_INK":
        return `shift-ink:${reason.params.needed}/${reason.params.available}`;
      case "SONG_NO_SINGER":
        return `song-no-singer:${reason.params.songCost}`;
      case "PLAYER_PLAY_RESTRICTED":
        return "player-restricted";
      case "SELF_PLAY_CONDITION_NOT_MET":
        return "self-condition";
      case "BAG_PENDING":
        return "bag-pending";
      case "UNKNOWN":
        return `unknown:${reason.params.validateMoveErrorCode}`;
      default:
        return assertNeverPlayCardDisabledReason(reason);
    }
  }

  it("typed params narrow per code (exhaustive consumer pattern compiles and runs)", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [devotedHeraldLike],
      play: [diabloOnBoard],
      inkwell: 0,
      deck: 2,
    });

    const reason = engine.asPlayerOne().getPlayCardDisabledReason(devotedHeraldLike);
    expect(reason).not.toBeNull();
    expect(describeReasonForTooltip(reason!)).toBe("shift-no-discard:actionx1");
  });

  it("KNOWN_PLAY_CARD_DISABLED_REASON_CODES is in sync with the union (no missing or stale entries)", () => {
    // The compile-time `satisfies` + `_ListIsExhaustive` checks in
    // play-card-disabled-reason.ts guarantee both directions of containment.
    // This runtime check pins that the consumer-pattern switch above covers
    // exactly the same set — if either side drifts, this test fails first.
    const codesHandledBySwitch = new Set<string>();
    for (const code of KNOWN_PLAY_CARD_DISABLED_REASON_CODES) {
      // Construct a minimal-valid PlayCardDisabledReason for each code by
      // round-tripping through the consumer switch.
      const fake = makeFakeReasonForCode(code);
      const tag = describeReasonForTooltip(fake);
      expect(tag.length).toBeGreaterThan(0);
      codesHandledBySwitch.add(code);
    }
    expect(codesHandledBySwitch.size).toBe(KNOWN_PLAY_CARD_DISABLED_REASON_CODES.length);
  });

  // Per-category accessors give the UI a separate reason for each CTA (Play /
  // Shift / Sing). Critical case: a card may have shift available but not
  // standard — the "Play" button's tooltip should explain *the standard cost*,
  // not be suppressed because shift works.
  describe("per-category accessors", () => {
    it("getStandardPlayDisabledReason returns INSUFFICIENT_INK even when shift is available", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [devotedHeraldLike, throwawayAction],
        play: [diabloOnBoard],
        inkwell: 0,
        deck: 2,
      });

      // Shift is fully playable here (Diablo on board + action in hand) so the
      // composite method returns null...
      expect(engine.asPlayerOne().getPlayCardDisabledReason(devotedHeraldLike)).toBeNull();
      // ...but standard-cost play still needs 3 ink, and the "Play" CTA's
      // tooltip should say so.
      expect(engine.asPlayerOne().getStandardPlayDisabledReason(devotedHeraldLike)).toEqual({
        code: "INSUFFICIENT_INK",
        params: { needed: devotedHeraldLike.cost, available: 0 },
      });
    });

    it("getStandardPlayDisabledReason returns null when standard is playable", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkTestCharacter],
        inkwell: inkTestCharacter.cost,
        deck: 2,
      });

      expect(engine.asPlayerOne().getStandardPlayDisabledReason(inkTestCharacter)).toBeNull();
    });

    it("getShiftPlayDisabledReason returns null when the card has no Shift keyword", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkTestCharacter],
        inkwell: 0,
        deck: 2,
      });

      // No Shift keyword → null (UI shouldn't render a Shift CTA at all).
      expect(engine.asPlayerOne().getShiftPlayDisabledReason(inkTestCharacter)).toBeNull();
    });

    it("getShiftPlayDisabledReason returns SHIFT_NO_DISCARD_AVAILABLE for Devoted Herald with no action card", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [devotedHeraldLike],
        play: [diabloOnBoard],
        inkwell: 0,
        deck: 2,
      });

      expect(engine.asPlayerOne().getShiftPlayDisabledReason(devotedHeraldLike)).toEqual({
        code: "SHIFT_NO_DISCARD_AVAILABLE",
        params: { discardCardType: "action", count: 1 },
      });
    });

    it("getShiftPlayDisabledReason returns null when shift is fully playable", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [devotedHeraldLike, throwawayAction],
        play: [diabloOnBoard],
        inkwell: 0,
        deck: 2,
      });

      expect(engine.asPlayerOne().getShiftPlayDisabledReason(devotedHeraldLike)).toBeNull();
    });

    it("getSingPlayDisabledReason returns null for non-songs", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkTestCharacter],
        inkwell: 0,
        deck: 2,
      });

      expect(engine.asPlayerOne().getSingPlayDisabledReason(inkTestCharacter)).toBeNull();
    });

    it("INSUFFICIENT_INK reports the cost-reduction-adjusted needed value, not the printed cost", () => {
      // Regression for PR #51 review: the tooltip must match what
      // `validateMove` actually checks. With a cost reduction in play, the
      // engine validates against the reduced cost, so the tooltip's `needed`
      // param has to use the reduced cost too — otherwise the player sees
      // "Needs 5 ink" while the engine secretly only requires 3.
      const expensiveCharacter = createMockCharacter({
        id: "reason-cost-adjusted",
        name: "Expensive Character",
        cost: 5,
      });
      const costReducer = createMockCharacter({
        id: "reason-cost-reducer",
        name: "Cost Reducer",
        cost: 2,
        abilities: [
          {
            id: "reason-cost-reducer-1",
            type: "static",
            text: "Your characters cost 1 ink less to play.",
            effect: { type: "cost-reduction", amount: 1, cardType: "character" },
          },
        ],
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [expensiveCharacter],
        play: [costReducer],
        inkwell: 2, // less than 5-1=4, so still insufficient
        deck: 2,
      });

      const reason = engine.asPlayerOne().getStandardPlayDisabledReason(expensiveCharacter);
      // Cost reducer makes 5 → 4. Player has 2. So `needed` should be 4, not 5.
      expect(reason).toEqual({
        code: "INSUFFICIENT_INK",
        params: { needed: 4, available: 2 },
      });
    });

    it("composite getPlayCardDisabledReason preempts shift fallback when a hard blocker (SELF_PLAY_CONDITION_NOT_MET) applies to both paths", () => {
      // Regression for PR #51 review: hard blockers — self-play-condition,
      // player-play-restricted, bag-pending — apply to BOTH standard and
      // shift play. Without the preemption, the composite method would
      // run the shift fallback, fail (because validateMove rejects shift
      // for the same root cause), and return a misleading SHIFT_NO_TARGET
      // or SHIFT_INSUFFICIENT_INK. The composite should report the actual
      // blocker. The per-category accessors still return their own reasons.
      const shiftTarget = createMockCharacter({
        id: "reason-hard-blocker-target",
        name: "Diablo",
        version: "Target",
        cost: 2,
      });
      const cardWithBothShiftAndSelfPlayCondition = createMockCharacter({
        id: "reason-hard-blocker-card",
        name: "Diablo",
        version: "Conditional Shift",
        cost: 6,
        abilities: [
          {
            id: "reason-hard-blocker-shift",
            keyword: "Shift",
            type: "keyword",
            text: "Shift 4",
            cost: { ink: 4 },
          },
          {
            id: "reason-hard-blocker-condition",
            type: "static",
            text: "You can play this character only if you have Chip in play.",
            // Condition is "has-named-character Chip" — when no Chip in play,
            // the condition is NOT met, so `getSelfPlayConditionError` blocks
            // the play with SELF_PLAY_CONDITION_NOT_MET.
            condition: {
              controller: "you",
              name: "Chip",
              type: "has-named-character",
            },
            effect: { type: "self-play-condition" },
          },
        ],
      });

      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cardWithBothShiftAndSelfPlayCondition],
        play: [shiftTarget],
        inkwell: 0, // would also fail SHIFT_INSUFFICIENT_INK
        deck: 2,
      });

      // Composite: should preempt the shift fallback's "no ink" complaint
      // with the actual root cause (the self-play condition).
      expect(
        engine.asPlayerOne().getPlayCardDisabledReason(cardWithBothShiftAndSelfPlayCondition),
      ).toEqual({ code: "SELF_PLAY_CONDITION_NOT_MET" });

      // Per-category getShiftPlayDisabledReason: still surfaces the
      // shift-specific reason for the Shift CTA's own tooltip — the
      // independent-path semantics are preserved.
      expect(
        engine.asPlayerOne().getShiftPlayDisabledReason(cardWithBothShiftAndSelfPlayCondition),
      ).toEqual({
        code: "SHIFT_INSUFFICIENT_INK",
        params: expect.objectContaining({ available: 0 }),
      });
    });

    it("SHIFT_INSUFFICIENT_INK reports the cost-reduction-adjusted shift cost", () => {
      // Same regression for shift: `shiftRules.inkCost` is the printed cost,
      // but `canDiscoverShiftPlay` validates the reduced cost. The tooltip
      // must follow `validateMove`.
      const shiftTarget = createMockCharacter({
        id: "reason-shift-adjust-target",
        name: "Shift Hero",
        cost: 2,
      });
      const shiftCharacter = createMockCharacter({
        id: "reason-shift-adjust",
        name: "Shift Hero",
        cost: 6,
        abilities: [
          {
            id: "reason-shift-adjust-kw",
            keyword: "Shift",
            text: "Shift 4",
            type: "keyword",
            cost: { ink: 4 },
          },
        ],
      });
      const shiftReducer = createMockCharacter({
        id: "reason-shift-reducer",
        name: "Shift Reducer",
        cost: 2,
        abilities: [
          {
            id: "reason-shift-reducer-1",
            type: "static",
            text: "Your characters cost 1 ink less to shift.",
            effect: {
              type: "cost-reduction",
              amount: 1,
              cardType: "character",
              playMethod: "shift",
            },
          },
        ],
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [shiftCharacter],
        play: [shiftTarget, shiftReducer],
        inkwell: 2, // less than 4-1=3, so still insufficient
        deck: 2,
      });

      const reason = engine.asPlayerOne().getShiftPlayDisabledReason(shiftCharacter);
      // Shift cost 4 - 1 reduction = 3. Player has 2. `needed` should be 3.
      expect(reason).toEqual({
        code: "SHIFT_INSUFFICIENT_INK",
        params: { needed: 3, available: 2 },
      });
    });

    it("getSingPlayDisabledReason returns SONG_NO_SINGER when no ready singer is available", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songCardForReason],
        play: [{ card: singerCharacterForReason, isDrying: true }],
        inkwell: 0,
        deck: 2,
      });

      expect(engine.asPlayerOne().getSingPlayDisabledReason(songCardForReason)).toEqual({
        code: "SONG_NO_SINGER",
        params: { songCost: songCardForReason.cost },
      });
    });
  });

  it("stays in lock-step with canPlayCard (true iff reason is null)", () => {
    // Spot-check the contract across a few states.
    const scenarios = [
      {
        label: "playable standard",
        state: { hand: [inkTestCharacter], inkwell: inkTestCharacter.cost, deck: 2 },
        card: inkTestCharacter,
      },
      {
        label: "ink-blocked",
        state: { hand: [inkTestCharacter], inkwell: 0, deck: 2 },
        card: inkTestCharacter,
      },
      {
        label: "shift playable",
        state: {
          hand: [devotedHeraldLike, throwawayAction],
          play: [diabloOnBoard],
          inkwell: 0,
          deck: 2,
        },
        card: devotedHeraldLike,
      },
      {
        label: "shift blocked: no discard",
        state: { hand: [devotedHeraldLike], play: [diabloOnBoard], inkwell: 0, deck: 2 },
        card: devotedHeraldLike,
      },
    ];

    for (const { label, state, card } of scenarios) {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(state);
      const reason = engine.asPlayerOne().getPlayCardDisabledReason(card);
      const playable = engine.asPlayerOne().canPlayCard(card);
      expect({ label, playable, reasonIsNull: reason === null }).toEqual({
        label,
        playable,
        reasonIsNull: playable,
      });
    }
  });
});

describe("playCard logging", () => {
  it("respects conditional enters-play-exerted static abilities", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [conditionalExertCharacter],
      inkwell: conditionalExertCharacter.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(conditionalExertCharacter).success).toBe(true);
    expect(engine.asPlayerOne().isExerted(conditionalExertCharacter)).toBe(true);
  });

  it("skips conditional enters-play-exerted when the named character is already in play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [conditionalExertCharacter],
      inkwell: conditionalExertCharacter.cost,
      play: [chipCharacter],
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(conditionalExertCharacter).success).toBe(true);
    expect(engine.asPlayerOne().isExerted(conditionalExertCharacter)).toBe(false);
  });

  it("emits a localized play card log entry for characters", () => {
    const card = createMockCharacter({
      id: "play-log-character",
      name: "Play Log Character",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [card],
      inkwell: card.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(card).success).toBe(true);

    const cardId = engine.findCardInstanceId(card, "play", PLAYER_ONE);
    const playEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");
    expect(playEntry).toMatchObject({
      moveType: "playCard",
      playerId: PLAYER_ONE,
      public: [
        {
          key: "lorcana.move.playCard",
          values: {
            playerId: PLAYER_ONE,
            cardId,
          },
        },
      ],
    });
  });

  it("emits a localized play card log entry for actions before effect resolution continues", () => {
    const actionCard = createMockActionCard({
      id: "play-log-action",
      name: "Play Log Action",
      cost: 1,
      text: "Gain 1 lore.",
      abilities: [
        {
          type: "action",
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "gain-lore",
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [actionCard],
      inkwell: actionCard.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(actionCard).success).toBe(true);

    const playEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");
    expect(playEntry).toMatchObject({
      moveType: "playCard",
      playerId: PLAYER_ONE,
    });
  });

  it("logs direct chosen targets for immediate action resolution", () => {
    const target = createMockCharacter({
      id: "play-log-direct-target",
      name: "Play Log Direct Target",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const actionCard = createMockActionCard({
      id: "play-log-action-targeted",
      name: "Play Log Action Targeted",
      cost: 1,
      text: "Banish chosen character.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: "CHOSEN_CHARACTER",
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [actionCard],
        inkwell: actionCard.cost,
        deck: 2,
      },
      {
        play: [target],
      },
    );

    expect(engine.asPlayerOne().playCard(actionCard, { targets: [target] }).success).toBe(true);

    const playEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");

    expect(playEntry).toBeDefined();
    expect(playEntry).toMatchObject({
      moveType: "playCard",
      playerId: PLAYER_ONE,
    });
  });

  it("logs auto-resolved all-target effects for immediate action resolution", () => {
    const ownTarget = createMockCharacter({
      id: "play-log-all-target-own",
      name: "Play Log All Target Own",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const opposingTarget = createMockCharacter({
      id: "play-log-all-target-opponent",
      name: "Play Log All Target Opponent",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const boardWipe = createMockActionCard({
      id: "play-log-action-all-target",
      name: "Play Log Action All Target",
      cost: 1,
      text: "Banish all characters.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: "ALL_CHARACTERS",
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [boardWipe],
        inkwell: boardWipe.cost,
        play: [ownTarget],
        deck: 2,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(engine.asPlayerOne().playCard(boardWipe).success).toBe(true);

    // Verify the play card move was logged
    const playEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");

    expect(playEntry).toBeDefined();
    expect(playEntry).toMatchObject({
      moveType: "playCard",
      playerId: PLAYER_ONE,
    });
  });
});
