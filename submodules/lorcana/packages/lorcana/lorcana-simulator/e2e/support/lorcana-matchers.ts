import type { MatcherReturnType } from "@playwright/test";
import type { LorcanaProjectedBoardView, LorcanaProjectedCard } from "@tcg/lorcana-engine";
import type {
  CanonicalPlayerId,
  LorcanaBrowserStatus,
} from "../../src/lib/features/simulator-devtools/harness/browser-harness.js";
import type {
  CardReadyState,
  LorcanaZoneId,
} from "../../src/lib/features/simulator/model/contracts.js";
import type { LorcanaSimulatorPomLike } from "./lorcana-simulator-pom.js";

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `'${value}'`;
  }

  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value);
}

function formatPlayers(players: readonly string[]): string {
  return `[${players.map((player) => formatValue(player)).join(", ")}]`;
}

function formatCardList(cards: LorcanaProjectedCard[]): string {
  return `[${cards
    .map((card) => `${card.fullName ?? card.id} (${card.zone})`)
    .map((value) => formatValue(value))
    .join(", ")}]`;
}

function isPlayerPom(value: unknown): value is LorcanaSimulatorPomLike {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as LorcanaSimulatorPomLike).getStatus === "function" &&
    typeof (value as LorcanaSimulatorPomLike).getBoard === "function" &&
    typeof (value as LorcanaSimulatorPomLike).getZoneCardCount === "function"
  );
}

async function getStatusOrThrow(received: unknown): Promise<LorcanaBrowserStatus> {
  if (!isPlayerPom(received)) {
    throw new Error("Expected a LorcanaSimulatorSeatPom as the matcher receiver.");
  }

  return received.getStatus();
}

async function getBoardOrThrow(received: unknown): Promise<LorcanaProjectedBoardView> {
  if (!isPlayerPom(received)) {
    throw new Error("Expected a LorcanaSimulatorSeatPom as the matcher receiver.");
  }

  return received.getBoard();
}

function getMatchingCards(board: LorcanaProjectedBoardView, label: string): LorcanaProjectedCard[] {
  return Object.values(board.cards).filter((card) => card.fullName === label);
}

function getSingleMatchingCard(
  board: LorcanaProjectedBoardView,
  label: string,
): {
  card: LorcanaProjectedCard | null;
  error?: string;
} {
  const cards = getMatchingCards(board, label);

  if (cards.length === 1) {
    return { card: cards[0] };
  }

  if (cards.length === 0) {
    return { card: null, error: `No projected card found for ${formatValue(label)}.` };
  }

  return {
    card: null,
    error: `Expected one projected card for ${formatValue(label)} but found ${cards.length}: ${formatCardList(cards)}.`,
  };
}

type SupportedKeyword = "challenger" | "resist";

export const lorcanaMatchers = {
  async toHaveOpeningTurnPlayer(
    this: { isNot: boolean },
    received: unknown,
    expectedPlayer: CanonicalPlayerId | undefined,
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const pass = status.openingTurnPlayer === expectedPlayer;

    return {
      pass,
      message: () =>
        `Expected opening-turn player ${this.isNot ? "not " : ""}to be ${formatValue(expectedPlayer)} but received ${formatValue(status.openingTurnPlayer)}.`,
    };
  },

  async toHavePendingMulligan(
    this: { isNot: boolean },
    received: unknown,
    expectedPlayers: CanonicalPlayerId[],
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const actualPlayers = status.pendingMulligan ?? [];
    const pass =
      actualPlayers.length === expectedPlayers.length &&
      actualPlayers.every((player, index) => player === expectedPlayers[index]);

    return {
      pass,
      message: () =>
        `Expected pending mulligan ${this.isNot ? "not " : ""}to be ${formatPlayers(expectedPlayers)} but received ${formatPlayers(actualPlayers)}.`,
    };
  },

  async toHavePriorityPlayer(
    this: { isNot: boolean },
    received: unknown,
    expectedPlayer: CanonicalPlayerId,
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const pass = status.priorityPlayer === expectedPlayer;

    return {
      pass,
      message: () =>
        `Expected priority player ${this.isNot ? "not " : ""}to be ${formatValue(expectedPlayer)} but received ${formatValue(status.priorityPlayer)}.`,
    };
  },

  async toHaveChoosingFirstPlayer(
    this: { isNot: boolean },
    received: unknown,
    expectedPlayer: CanonicalPlayerId | undefined,
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const pass = status.choosingFirstPlayer === expectedPlayer;

    return {
      pass,
      message: () =>
        `Expected choosing-first-player ${this.isNot ? "not " : ""}to be ${formatValue(expectedPlayer)} but received ${formatValue(status.choosingFirstPlayer)}.`,
    };
  },

  async toBeInPhase(
    this: { isNot: boolean },
    received: unknown,
    expectedPhase: string,
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const pass = status.phase === expectedPhase;

    return {
      pass,
      message: () =>
        `Expected phase ${this.isNot ? "not " : ""}to be ${formatValue(expectedPhase)} but received ${formatValue(status.phase)}.`,
    };
  },

  async toBeInGameSegment(
    this: { isNot: boolean },
    received: unknown,
    expectedSegment: string,
  ): Promise<MatcherReturnType> {
    const status = await getStatusOrThrow(received);
    const pass = status.gameSegment === expectedSegment;

    return {
      pass,
      message: () =>
        `Expected game segment ${this.isNot ? "not " : ""}to be ${formatValue(expectedSegment)} but received ${formatValue(status.gameSegment)}.`,
    };
  },

  async toHaveCardCountInZone(
    this: { isNot: boolean },
    received: unknown,
    expected: {
      zone: LorcanaZoneId;
      player: string;
      count: number;
    },
  ): Promise<MatcherReturnType> {
    if (!isPlayerPom(received)) {
      throw new Error("Expected a LorcanaSimulatorSeatPom as the matcher receiver.");
    }

    const actualCount = await received.getZoneCardCount({
      zone: expected.zone,
      player: expected.player,
    });
    const pass = actualCount === expected.count;

    return {
      pass,
      message: () =>
        `Expected zone '${expected.zone}' for player '${expected.player}' ${this.isNot ? "not " : ""}to have card count ${expected.count} but received ${actualCount}.`,
    };
  },

  async toHaveCardInZone(
    this: { isNot: boolean },
    received: unknown,
    expected: {
      card: string;
      zone: LorcanaZoneId;
    },
  ): Promise<MatcherReturnType> {
    const board = await getBoardOrThrow(received);
    const { card, error } = getSingleMatchingCard(board, expected.card);
    const pass = !error && card?.zone === expected.zone;

    return {
      pass,
      message: () =>
        error ??
        `Expected card ${formatValue(expected.card)} ${this.isNot ? "not " : ""}to be in zone ${formatValue(expected.zone)} but received ${formatValue(card?.zone)}.`,
    };
  },

  async toHaveCardStrength(
    this: { isNot: boolean },
    received: unknown,
    expected: {
      card: string;
      value: number;
    },
  ): Promise<MatcherReturnType> {
    const board = await getBoardOrThrow(received);
    const { card, error } = getSingleMatchingCard(board, expected.card);
    const actualStrength = card?.strength;
    const pass = !error && actualStrength === expected.value;

    return {
      pass,
      message: () =>
        error ??
        `Expected card ${formatValue(expected.card)} ${this.isNot ? "not " : ""}to have strength ${expected.value} but received ${formatValue(actualStrength)}.`,
    };
  },

  async toHaveCardReadyState(
    this: { isNot: boolean },
    received: unknown,
    expected: {
      card: string;
      readyState: CardReadyState;
    },
  ): Promise<MatcherReturnType> {
    const board = await getBoardOrThrow(received);
    const { card, error } = getSingleMatchingCard(board, expected.card);
    const actualReadyState: CardReadyState =
      card?.exerted === true ? "exerted" : card?.exerted === false ? "ready" : "unknown";
    const pass = !error && actualReadyState === expected.readyState;

    return {
      pass,
      message: () =>
        error ??
        `Expected card ${formatValue(expected.card)} ${this.isNot ? "not " : ""}to have ready state ${formatValue(expected.readyState)} but received ${formatValue(actualReadyState)}.`,
    };
  },

  async toHaveCardKeywordValue(
    this: { isNot: boolean },
    received: unknown,
    expected: {
      card: string;
      keyword: SupportedKeyword;
      value: number;
    },
  ): Promise<MatcherReturnType> {
    const board = await getBoardOrThrow(received);
    const { card, error } = getSingleMatchingCard(board, expected.card);
    const actualValue = card?.keywordValues?.[expected.keyword] ?? 0;
    const pass = !error && actualValue === expected.value;

    return {
      pass,
      message: () =>
        error ??
        `Expected card ${formatValue(expected.card)} ${this.isNot ? "not " : ""}to have keyword ${formatValue(expected.keyword)} value ${expected.value} but received ${actualValue}.`,
    };
  },
};
