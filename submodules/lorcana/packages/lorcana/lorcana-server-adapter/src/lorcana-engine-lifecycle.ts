import {
  createPlayerId,
  getLorcanaServerAuthoritativeSnapshot,
  loadLorcanaServerAuthoritativeSnapshot,
  LorcanaServer,
  type LorcanaEngineInit,
  type LorcanaServerAuthoritativeSnapshot,
  type Player,
} from "@tcg/lorcana-engine";
import { fromDeckToCardInstances } from "@tcg/lorcana-cards";
import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
  TimeControlConfig,
} from "@tcg/shared/game-engine";
import { LorcanaServerEngine } from "./lorcana-server-engine";

/**
 * Lorcana implementation of the {@link GameAdapter.createServerEngine} hook.
 * Wires the play module's generic create-input into a {@link LorcanaServer}
 * and wraps the result in the game-agnostic {@link ServerGameEngine}.
 */
export async function lorcanaCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  const players: Player[] = [{ id: input.player1Id }, { id: input.player2Id }];
  // Series rule: when the play module designates a chooser (loser of the
  // most recent decisive game in a best-of-N), that player gets the
  // chooseWhoGoesFirst privilege. Game 1 has no designation, so we fall
  // back to a coin flip. We refuse a chooser id that is neither seat —
  // silently coercing one would produce a "player" the engine has no
  // record of and break the setup phase.
  if (
    input.firstPlayerChooserId !== undefined &&
    input.firstPlayerChooserId !== input.player1Id &&
    input.firstPlayerChooserId !== input.player2Id
  ) {
    throw new Error(
      `lorcanaCreateServerEngine: firstPlayerChooserId "${input.firstPlayerChooserId}" ` +
        `must match player1Id ("${input.player1Id}") or player2Id ("${input.player2Id}")`,
    );
  }
  const goingFirst = input.firstPlayerChooserId
    ? createPlayerId(input.firstPlayerChooserId)
    : Math.random() < 0.5
      ? createPlayerId(input.player1Id)
      : createPlayerId(input.player2Id);
  const init: LorcanaEngineInit = {
    seed: input.seed,
    cardsMaps: input.cardsMaps,
    matchID: input.matchID,
    gameID: input.gameID,
    players,
    cardCatalog: getLorcanaCardCatalogSync(),
    goingFirst,
    timeControl: toLorcanaTimeControl(input.timeControl),
  };
  const engine = new LorcanaServer({ ...init, players });
  return new LorcanaServerEngine(engine);
}

/**
 * Lorcana implementation of {@link GameAdapter.serializeEngine}.
 * Builds the persistence envelope using the engine's authoritative snapshot.
 */
export function lorcanaSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const lorcana = unwrap(engine);
  const auth = getLorcanaServerAuthoritativeSnapshot(lorcana, normalizeCardsMaps(cardsMaps));
  return {
    gameSlug: "lorcana",
    state: auth.state,
    historyLength: 0,
    cardsMaps: auth.cardsMaps,
    metadata: auth.undoStack ? { undoStack: auth.undoStack } : undefined,
  };
}

/**
 * Lorcana implementation of {@link GameAdapter.restoreEngine}.
 */
export async function lorcanaRestoreEngine(
  snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const cardsMaps =
    normalizeOptionalCardsMaps(snapshot.cardsMaps) ?? buildCardsMapsFromHistoricDecks(context);
  if (!cardsMaps) {
    throw new Error("Cannot restore Lorcana engine: missing cardsMaps and historic decks");
  }

  const undoStack = extractUndoStack(snapshot.metadata);
  const cardCatalog = getLorcanaCardCatalogSync();
  const players = [
    { id: createPlayerId(context.player1Id) },
    { id: createPlayerId(context.player2Id) },
  ];

  const lorcanaServer = loadLorcanaServerAuthoritativeSnapshot(
    {
      state: snapshot.state as LorcanaServerAuthoritativeSnapshot["state"],
      cardsMaps,
      ...(undoStack ? { undoStack } : {}),
    },
    cardCatalog,
    undefined,
    players,
  );

  return new LorcanaServerEngine(lorcanaServer);
}

/**
 * Lorcana implementation of {@link GameAdapter.extractCardsMapsFromSnapshot}.
 */
export function lorcanaExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return normalizeOptionalCardsMaps(snapshot.cardsMaps) ?? emptyCardsMaps();
}

/**
 * Translate the universal {@link TimeControlConfig} into Lorcana's native
 * `LorcanaEngineInit["timeControl"]` discriminated union.
 *
 * Universal fields cover most of Lorcana's clock parameters; Lorcana-specific
 * fields (delayMs, graceMs, resetTimeOnSkipMs, etc.) flow through the
 * `extras` slot. Lorcana doesn't ship a `priority` clock mode today — we
 * reject it loudly here rather than silently fall back to `none`.
 */
function toLorcanaTimeControl(
  config: TimeControlConfig | undefined,
): LorcanaEngineInit["timeControl"] {
  if (!config || config.mode === "none") {
    return { mode: "none" };
  }
  if (config.mode === "chess") {
    const extras = (config.extras ?? {}) as {
      delayMs?: number;
      graceMs?: number;
      resetTimeOnSkipMs?: number;
    };
    return {
      mode: "chess",
      config: {
        initialReserveMs: config.initialReserveMs,
        incrementMs: config.incrementMs ?? 0,
        delayMs: config.delayMs ?? extras.delayMs ?? 0,
        graceMs: config.graceMs ?? extras.graceMs ?? 0,
        resetTimeOnSkipMs: extras.resetTimeOnSkipMs ?? 0,
        lossPolicy: config.lossPolicy ?? "lose-on-time",
        ...(config.maxDecisionTimeMs !== undefined
          ? { maxDecisionTimeMs: config.maxDecisionTimeMs }
          : {}),
      },
    };
  }
  if (config.mode === "dynamic") {
    // Lorcana's dynamic clock takes a richer config than the universal
    // shape models (reserveCapMs, resetTimeOnSkipMs, graceMs,
    // maxDecisionTimeMs). The adapter pulls those out of `extras` so the
    // universal shape stays game-agnostic.
    const extras = (config.extras ?? {}) as {
      reserveCapMs?: number;
      resetTimeOnSkipMs?: number;
      graceMs?: number;
      maxDecisionTimeMs?: number;
    };
    return {
      mode: "dynamic",
      config: {
        initialReserveMs: config.initialReserveMs,
        reserveCapMs: extras.reserveCapMs ?? config.initialReserveMs,
        perActionBonusMs: config.perActionBonusMs ?? 0,
        perTurnPassBonusMs: config.turnPassBonusMs ?? 0,
        resetTimeOnSkipMs: extras.resetTimeOnSkipMs ?? 0,
        graceMs: extras.graceMs ?? 0,
        maxDecisionTimeMs: extras.maxDecisionTimeMs ?? config.initialReserveMs,
      } as never,
    };
  }
  // mode === "priority" — not supported by the Lorcana engine yet.
  throw new Error(
    `Lorcana adapter does not support time-control mode "${config.mode}". ` +
      `Supported modes: "none", "chess", "dynamic".`,
  );
}

function unwrap(engine: ServerGameEngine): LorcanaServer {
  if (engine instanceof LorcanaServerEngine) return engine.engine;
  throw new Error(
    "Lorcana adapter received a ServerGameEngine that is not a LorcanaServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}

function normalizeCardsMaps(value: unknown): CardsMaps {
  return normalizeOptionalCardsMaps(value) ?? emptyCardsMaps();
}

function emptyCardsMaps(): CardsMaps {
  return { cardInstances: {}, owners: {} };
}

function normalizeOptionalCardsMaps(value: unknown): CardsMaps | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<CardsMaps>;
  return {
    cardInstances:
      candidate.cardInstances && typeof candidate.cardInstances === "object"
        ? { ...candidate.cardInstances }
        : {},
    owners:
      candidate.owners && typeof candidate.owners === "object"
        ? Object.fromEntries(
            Object.entries(candidate.owners).map(([ownerId, instanceIds]) => [
              ownerId,
              Array.isArray(instanceIds) ? [...instanceIds] : [],
            ]),
          )
        : {},
  };
}

function extractUndoStack(
  metadata: unknown,
): LorcanaServerAuthoritativeSnapshot["undoStack"] | undefined {
  if (!metadata || typeof metadata !== "object") return undefined;
  const candidate = (metadata as { undoStack?: unknown }).undoStack;
  if (!Array.isArray(candidate)) return undefined;

  const entries = candidate.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const e = entry as Partial<
      NonNullable<LorcanaServerAuthoritativeSnapshot["undoStack"]>[number]
    >;
    if (
      typeof e.stateID !== "number" ||
      typeof e.playerId !== "string" ||
      !e.state ||
      typeof e.state !== "object" ||
      !e.runtimeSnapshot ||
      typeof e.runtimeSnapshot !== "object" ||
      typeof e.undoneStateID !== "number"
    ) {
      return [];
    }
    return [
      {
        stateID: e.stateID,
        playerId: e.playerId,
        state: e.state as LorcanaServerAuthoritativeSnapshot["state"],
        runtimeSnapshot: e.runtimeSnapshot as NonNullable<
          LorcanaServerAuthoritativeSnapshot["undoStack"]
        >[number]["runtimeSnapshot"],
        undoneStateID: e.undoneStateID,
        ...(typeof e.undoneMoveId === "string" ? { undoneMoveId: e.undoneMoveId } : {}),
      },
    ];
  });

  return entries.length === candidate.length ? entries : undefined;
}

function buildCardsMapsFromHistoricDecks(
  context: ServerEngineRestoreContext,
): CardsMaps | undefined {
  if (!context.historicDecks) return undefined;
  return fromDeckToCardInstances([
    {
      owner: context.player1Id,
      deck: context.historicDecks.player1Deck.map((entry) => ({
        cardId: entry.cardPublicId,
        qty: entry.quantity,
      })),
    },
    {
      owner: context.player2Id,
      deck: context.historicDecks.player2Deck.map((entry) => ({
        cardId: entry.cardPublicId,
        qty: entry.quantity,
      })),
    },
  ]);
}
