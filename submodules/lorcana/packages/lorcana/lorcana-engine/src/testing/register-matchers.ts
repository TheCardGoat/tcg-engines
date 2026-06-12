import { expect } from "bun:test";
import type { CardInstanceId } from "#core";
import type { LorcanaClient } from "../lorcana-client";
import type { LorcanaServer } from "../lorcana-server";
import type { LorcanaProjectedCard } from "../types";

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toBeSuccessfulCommand(): void;
    toBeInZone(expectedZone: string): void;
    toBeInPosition(expectedPosition: number): void;
    toHaveCardCountInZone(expected: { zone: string; player: string; count: number }): void;
    toHaveZoneCounts(
      expected: Partial<Record<"hand" | "deck" | "play" | "inkwell" | "discard", number>>,
    ): void;
    toHavePriorityPlayer(expectedPlayer: string): void;
    toHavePendingMulligan(expectedPlayers: string[]): void;
    toHaveOpeningTurnPlayer(expectedPlayer: string | undefined): void;
    toHaveChoosingFirstPlayer(expectedPlayer: string | undefined): void;
    toBeInPhase(expectedPhase: string): void;
    toBeInGameSegment(expectedSegment: string): void;
    toBeExerted(card: unknown): void;
    toBeReady(card: unknown): void;
    toHaveDamage(expected: { card: unknown; value: number }): void;
    toHaveLore(expected: { card: unknown; value: number }): void;
    toHaveKeyword(expected: { card: unknown; keyword: string; value?: number }): void;
    toHaveRestriction(expected: { card: unknown; restriction: string }): void;
    toHaveGrantedAbility(expected: { card: unknown; ability: string }): void;
    toHaveCardsUnder(expected: { card: unknown; count: number }): void;
    toBeAtLocation(expected: { card: unknown; location: unknown }): void;
    toHavePendingEffectCount(expectedCount: number): void;
  }
}

type ZoneCardCountExpectation = {
  zone: string;
  player: string;
  count: number;
};

type ZoneCountsExpectation = Partial<
  Record<"hand" | "deck" | "play" | "inkwell" | "discard", number>
>;

type RuntimeCardLike = {
  zoneID?: unknown;
  zone?: unknown;
  zoneIndex?: unknown;
  position?: unknown;
};

type SuccessfulCommandLike = {
  success: boolean;
};

type EngineLike = Pick<
  LorcanaClient | LorcanaServer,
  | "getCardsInZone"
  | "getCurrentPhase"
  | "getActivePlayer"
  | "getGameSegment"
  | "getPendingMulliganPlayers"
  | "getOpeningTurnPlayer"
  | "getChoosingFirstPlayer"
>;

type ClientMatcherLike = Pick<
  LorcanaClient,
  | "isExerted"
  | "getDamage"
  | "getCardLore"
  | "hasKeyword"
  | "getKeywordValue"
  | "hasTemporaryRestriction"
  | "hasTemporaryAbility"
  | "getCardsUnderCount"
  | "getCardLocationId"
  | "getCard"
  | "getZonesCardCount"
  | "getPendingEffects"
>;

type NumericCardExpectation = {
  card: LorcanaProjectedCard;
  value: number;
};

type KeywordExpectation = {
  card: LorcanaProjectedCard;
  keyword: string;
  value?: number;
};

type RestrictionExpectation = {
  card: LorcanaProjectedCard;
  restriction: string;
};

type GrantedAbilityExpectation = {
  card: LorcanaProjectedCard;
  ability: string;
};

type CardsUnderExpectation = {
  card: LorcanaProjectedCard;
  count: number;
};

type AtLocationExpectation = {
  card: LorcanaProjectedCard;
  location: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEngineLike(value: unknown): value is EngineLike {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.getCardsInZone === "function" &&
    typeof value.getCurrentPhase === "function" &&
    typeof value.getActivePlayer === "function" &&
    typeof value.getGameSegment === "function" &&
    typeof value.getPendingMulliganPlayers === "function" &&
    typeof value.getOpeningTurnPlayer === "function" &&
    typeof value.getChoosingFirstPlayer === "function"
  );
}

function isClientMatcherLike(value: unknown): value is ClientMatcherLike {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.isExerted === "function" &&
    typeof value.getDamage === "function" &&
    typeof value.getCardLore === "function" &&
    typeof value.hasKeyword === "function" &&
    typeof value.getKeywordValue === "function" &&
    typeof value.getCardsUnderCount === "function" &&
    typeof value.getCardLocationId === "function" &&
    typeof value.getCard === "function" &&
    typeof value.getPendingEffects === "function"
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `'${value}'`;
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}

function validateZoneExpectation(
  expected: unknown,
): expected is { zone: string; player: string; count: number } {
  return (
    isRecord(expected) &&
    typeof expected.zone === "string" &&
    typeof expected.player === "string" &&
    typeof expected.count === "number"
  );
}

function validatePlayerListExpectation(expected: unknown): expected is string[] {
  return Array.isArray(expected) && expected.every((player) => typeof player === "string");
}

function validateNumericCardExpectation(expected: unknown): expected is NumericCardExpectation {
  return isRecord(expected) && "card" in expected && typeof expected.value === "number";
}

function validateZoneCountsExpectation(expected: unknown): expected is ZoneCountsExpectation {
  if (!isRecord(expected)) {
    return false;
  }

  return Object.entries(expected).every(
    ([key, value]) =>
      ["hand", "deck", "play", "inkwell", "discard"].includes(key) && typeof value === "number",
  );
}

function validateKeywordExpectation(expected: unknown): expected is KeywordExpectation {
  return (
    isRecord(expected) &&
    "card" in expected &&
    typeof expected.keyword === "string" &&
    (expected.value === undefined || typeof expected.value === "number")
  );
}

function validateRestrictionExpectation(expected: unknown): expected is RestrictionExpectation {
  return isRecord(expected) && "card" in expected && typeof expected.restriction === "string";
}

function validateGrantedAbilityExpectation(
  expected: unknown,
): expected is GrantedAbilityExpectation {
  return isRecord(expected) && "card" in expected && typeof expected.ability === "string";
}

function validateCardsUnderExpectation(expected: unknown): expected is CardsUnderExpectation {
  return isRecord(expected) && "card" in expected && typeof expected.count === "number";
}

function validateAtLocationExpectation(expected: unknown): expected is AtLocationExpectation {
  return isRecord(expected) && "card" in expected && "location" in expected;
}

function formatPlayerList(players: readonly string[]): string {
  return `[${players.map((player) => formatValue(player)).join(", ")}]`;
}

function isRuntimeCardLike(value: unknown): value is RuntimeCardLike {
  return isRecord(value);
}

function isSuccessfulCommandLike(value: unknown): value is SuccessfulCommandLike {
  return isRecord(value) && typeof value.success === "boolean";
}

function formatCommandResult(value: unknown): string {
  if (!isRecord(value)) {
    return formatValue(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[unserializable command result]";
  }
}

function normalizeZoneId(zone: string): string {
  const separatorIndex = zone.indexOf(":");
  return separatorIndex === -1 ? zone : zone.slice(0, separatorIndex);
}

expect.extend({
  toBeSuccessfulCommand(received: unknown) {
    if (!isSuccessfulCommandLike(received)) {
      return {
        pass: false,
        message: () =>
          "toBeSuccessfulCommand expects a command result object with a boolean success field.",
      };
    }

    const pass = received.success === true;

    return {
      pass,
      message: () =>
        pass
          ? `Expected command not to succeed, but received ${formatCommandResult(received)}.`
          : `Expected command to succeed, but received ${formatCommandResult(received)}.`,
    };
  },

  toBeInZone(received: unknown, expectedZone: string) {
    if (!isRuntimeCardLike(received)) {
      return {
        pass: false,
        message: () => "toBeInZone expects a runtime card object as the matcher receiver.",
      };
    }

    const rawZone =
      typeof received.zoneID === "string"
        ? received.zoneID
        : typeof received.zone === "string"
          ? received.zone
          : undefined;

    if (!rawZone) {
      return {
        pass: false,
        message: () => "toBeInZone could not read zone from the received runtime card object.",
      };
    }

    const actualZone = normalizeZoneId(rawZone);
    const pass = actualZone === expectedZone;

    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to be in zone ${formatValue(expectedZone)}.`
          : `Expected card to be in zone ${formatValue(expectedZone)} but received ${formatValue(actualZone)}.`,
    };
  },

  toBeInPosition(received: unknown, expectedPosition: number) {
    if (!isRuntimeCardLike(received)) {
      return {
        pass: false,
        message: () => "toBeInPosition expects a runtime card object as the matcher receiver.",
      };
    }

    const explicitPosition = received.position;
    const fallbackZoneIndex = received.zoneIndex;
    const actualPosition =
      typeof explicitPosition === "number"
        ? explicitPosition
        : typeof fallbackZoneIndex === "number"
          ? fallbackZoneIndex + 1
          : undefined;

    if (typeof actualPosition !== "number") {
      return {
        pass: false,
        message: () =>
          "toBeInPosition could not read a numeric position from the received runtime card object.",
      };
    }

    const pass = actualPosition === expectedPosition;
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to be in position ${formatValue(expectedPosition)}.`
          : `Expected card to be in position ${formatValue(expectedPosition)} but received ${formatValue(actualPosition)}.`,
    };
  },

  toHaveCardCountInZone(received: unknown, expected: ZoneCardCountExpectation) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toHaveCardCountInZone expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    if (!validateZoneExpectation(expected)) {
      return {
        pass: false,
        message: () =>
          "toHaveCardCountInZone expects an object: { zone: string; player: string; count: number }.",
      };
    }

    const actualCount = received.getCardsInZone(expected.zone, expected.player).count;
    const pass = actualCount === expected.count;

    return {
      pass,
      message: () =>
        pass
          ? `Expected zone '${expected.zone}' for player '${expected.player}' not to have card count ${expected.count}.`
          : `Expected zone '${expected.zone}' for player '${expected.player}' to have card count ${expected.count} but received ${actualCount}.`,
    };
  },

  toHaveZoneCounts(received: unknown, expected: ZoneCountsExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveZoneCounts expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateZoneCountsExpectation(expected)) {
      return {
        pass: false,
        message: () =>
          "toHaveZoneCounts expects a partial zone-count object keyed by hand/deck/play/inkwell/discard.",
      };
    }

    const actualCounts = received.getZonesCardCount();
    const pass = Object.entries(expected).every(
      ([zone, count]) => actualCounts[zone as keyof typeof actualCounts] === count,
    );

    return {
      pass,
      message: () =>
        pass
          ? `Expected zone counts not to match ${JSON.stringify(expected)}.`
          : `Expected zone counts ${JSON.stringify(expected)} but received ${JSON.stringify(actualCounts)}.`,
    };
  },

  toHavePriorityPlayer(received: unknown, expectedPlayer: string) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toHavePriorityPlayer expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    const actualPriority = received.getActivePlayer();
    const pass = actualPriority === expectedPlayer;

    return {
      pass,
      message: () =>
        pass
          ? `Expected priority holder not to be ${formatValue(expectedPlayer)}.`
          : `Expected priority holder to be ${formatValue(expectedPlayer)} but received ${formatValue(actualPriority)}.`,
    };
  },

  toBeInPhase(received: unknown, expectedPhase: string) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toBeInPhase expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    const actualPhase = received.getCurrentPhase();
    const pass = actualPhase === expectedPhase;

    return {
      pass,
      message: () =>
        pass
          ? `Expected phase not to be ${formatValue(expectedPhase)}.`
          : `Expected phase to be ${formatValue(expectedPhase)} but received ${formatValue(actualPhase)}.`,
    };
  },

  toBeInGameSegment(received: unknown, expectedSegment: string) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toBeInGameSegment expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    const actualSegment = received.getGameSegment();
    const pass = actualSegment === expectedSegment;

    return {
      pass,
      message: () =>
        pass
          ? `Expected game segment not to be ${formatValue(expectedSegment)}.`
          : `Expected game segment to be ${formatValue(expectedSegment)} but received ${formatValue(actualSegment)}.`,
    };
  },

  toHavePendingMulligan(received: unknown, expectedPlayers: string[]) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toHavePendingMulligan expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    if (!validatePlayerListExpectation(expectedPlayers)) {
      return {
        pass: false,
        message: () => "toHavePendingMulligan expects an array of player IDs.",
      };
    }

    const actualPending = received.getPendingMulliganPlayers().map(String);
    const pass =
      actualPending.length === expectedPlayers.length &&
      actualPending.every((playerId, index) => playerId === expectedPlayers[index]);

    return {
      pass,
      message: () =>
        pass
          ? `Expected pending mulligan not to be ${formatPlayerList(expectedPlayers)}.`
          : `Expected pending mulligan to be ${formatPlayerList(expectedPlayers)} but received ${formatPlayerList(actualPending)}.`,
    };
  },

  toHaveOpeningTurnPlayer(received: unknown, expectedPlayer: string | undefined) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toHaveOpeningTurnPlayer expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    const actualPlayer = received.getOpeningTurnPlayer();
    const pass = actualPlayer === expectedPlayer;

    return {
      pass,
      message: () =>
        pass
          ? `Expected opening-turn player not to be ${formatValue(expectedPlayer)}.`
          : `Expected opening-turn player to be ${formatValue(expectedPlayer)} but received ${formatValue(actualPlayer)}.`,
    };
  },

  toHaveChoosingFirstPlayer(received: unknown, expectedPlayer: string | undefined) {
    if (!isEngineLike(received)) {
      return {
        pass: false,
        message: () =>
          "toHaveChoosingFirstPlayer expects a LorcanaClient or LorcanaServer instance as the matcher receiver.",
      };
    }

    const actualPlayer = received.getChoosingFirstPlayer();
    const pass = actualPlayer === expectedPlayer;

    return {
      pass,
      message: () =>
        pass
          ? `Expected choosing-first-player not to be ${formatValue(expectedPlayer)}.`
          : `Expected choosing-first-player to be ${formatValue(expectedPlayer)} but received ${formatValue(actualPlayer)}.`,
    };
  },

  toBeExerted(received: unknown, card: LorcanaProjectedCard) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toBeExerted expects a LorcanaClient-like matcher receiver.",
      };
    }

    const pass = received.isExerted(card.id as CardInstanceId);
    return {
      pass,
      message: () => (pass ? "Expected card not to be exerted." : "Expected card to be exerted."),
    };
  },

  toBeReady(received: unknown, card: LorcanaProjectedCard) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toBeReady expects a LorcanaClient-like matcher receiver.",
      };
    }

    const pass = !received.isExerted(card.id as CardInstanceId);
    return {
      pass,
      message: () => (pass ? "Expected card not to be ready." : "Expected card to be ready."),
    };
  },

  toHaveDamage(received: unknown, expected: NumericCardExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveDamage expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateNumericCardExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveDamage expects { card, value }.",
      };
    }

    const actualDamage = received.getDamage(expected.card as never);
    const pass = actualDamage === expected.value;
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to have damage ${expected.value}.`
          : `Expected card to have damage ${expected.value} but received ${actualDamage}.`,
    };
  },

  toHaveLore(received: unknown, expected: NumericCardExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveLore expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateNumericCardExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveLore expects { card, value }.",
      };
    }

    const actualLore = received.getCardLore(expected.card as never);
    const pass = actualLore === expected.value;
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to have lore ${expected.value}.`
          : `Expected card to have lore ${expected.value} but received ${actualLore}.`,
    };
  },

  toHaveKeyword(received: unknown, expected: KeywordExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveKeyword expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateKeywordExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveKeyword expects { card, keyword, value? }.",
      };
    }

    const hasKeyword = received.hasKeyword(expected.card as never, expected.keyword);
    const actualValue =
      expected.keyword === "Challenger" || expected.keyword === "Resist"
        ? received.getKeywordValue(expected.card as never, expected.keyword)
        : null;
    const pass =
      expected.value === undefined ? hasKeyword : hasKeyword && actualValue === expected.value;

    return {
      pass,
      message: () => {
        if (expected.value === undefined) {
          return pass
            ? `Expected card not to have keyword ${formatValue(expected.keyword)}.`
            : `Expected card to have keyword ${formatValue(expected.keyword)}.`;
        }

        return pass
          ? `Expected card not to have keyword ${formatValue(expected.keyword)} with value ${expected.value}.`
          : `Expected card to have keyword ${formatValue(expected.keyword)} with value ${expected.value} but received ${formatValue(actualValue)}.`;
      },
    };
  },

  toHaveRestriction(received: unknown, expected: RestrictionExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveRestriction expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateRestrictionExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveRestriction expects { card, restriction }.",
      };
    }

    const pass = received.hasTemporaryRestriction(expected.card as never, expected.restriction);
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to have restriction ${formatValue(expected.restriction)}.`
          : `Expected card to have restriction ${formatValue(expected.restriction)}.`,
    };
  },

  toHaveGrantedAbility(received: unknown, expected: GrantedAbilityExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveGrantedAbility expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateGrantedAbilityExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveGrantedAbility expects { card, ability }.",
      };
    }

    const pass = received.hasTemporaryAbility(expected.card as never, expected.ability);
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to have temporary ability ${formatValue(expected.ability)}.`
          : `Expected card to have temporary ability ${formatValue(expected.ability)}.`,
    };
  },

  toHaveCardsUnder(received: unknown, expected: CardsUnderExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHaveCardsUnder expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateCardsUnderExpectation(expected)) {
      return {
        pass: false,
        message: () => "toHaveCardsUnder expects { card, count }.",
      };
    }

    const actualCount = received.getCardsUnderCount(expected.card as never);
    const pass = actualCount === expected.count;
    return {
      pass,
      message: () =>
        pass
          ? `Expected card not to have ${expected.count} cards under it.`
          : `Expected card to have ${expected.count} cards under it but received ${actualCount}.`,
    };
  },

  toBeAtLocation(received: unknown, expected: AtLocationExpectation) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toBeAtLocation expects a LorcanaClient-like matcher receiver.",
      };
    }

    if (!validateAtLocationExpectation(expected)) {
      return {
        pass: false,
        message: () => "toBeAtLocation expects { card, location }.",
      };
    }

    let expectedLocationId: unknown;
    try {
      expectedLocationId = received.getCard(expected.location as never)?.id;
    } catch {
      expectedLocationId = undefined;
    }

    const actualLocationId = received.getCardLocationId(expected.card as never);
    const pass = actualLocationId !== undefined && actualLocationId === expectedLocationId;
    return {
      pass,
      message: () =>
        pass
          ? "Expected card not to be at the specified location."
          : `Expected card to be at location ${formatValue(expectedLocationId)} but received ${formatValue(actualLocationId)}.`,
    };
  },

  toHavePendingEffectCount(received: unknown, expectedCount: number) {
    if (!isClientMatcherLike(received)) {
      return {
        pass: false,
        message: () => "toHavePendingEffectCount expects a LorcanaClient-like matcher receiver.",
      };
    }

    const actualCount = received.getPendingEffects().length;
    const pass = actualCount === expectedCount;
    return {
      pass,
      message: () =>
        pass
          ? `Expected pending effect count not to be ${expectedCount}.`
          : `Expected pending effect count to be ${expectedCount} but received ${actualCount}.`,
    };
  },
});
