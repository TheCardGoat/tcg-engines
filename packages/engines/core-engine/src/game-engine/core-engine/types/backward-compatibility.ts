/**
 * Backward Compatibility Type Aliases
 *
 * This file contains type aliases for backward compatibility with older versions
 * of the core-engine. These types are deprecated and should not be used in new code.
 *
 * For error type compatibility, see ../errors/error-compatibility.ts
 */

import type { CoreCardFilterDSL } from "../card/core-card-filter";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { GameCard } from "../card/game-card";
import type { FnContext, GameDefinition } from "../game-configuration";
import type { Move, MoveFn } from "../move/move-types";
import type { CoreCtx } from "../state/context";
import type {
  CardInstanceID,
  InstanceId,
  PlayerID,
  PlayerId,
  PublicId,
  ZoneId,
} from "./core-types";
import type {
  BaseCoreCardFilter,
  BaseGameState,
  BasePlayerState,
  DefaultCardDefinition,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "./game-specific-types";
import type { Result } from "./result";

// Core type aliases
/** @deprecated Use PlayerID instead */
export type Player = PlayerID;

/** @deprecated Use InstanceId instead */
export type CardId = InstanceId;

/** @deprecated Use PublicId instead */
export type CardDefinitionId = PublicId;

/** @deprecated Use ZoneId instead */
export type ZoneIdentifier = ZoneId;

// Card abstraction aliases
/** @deprecated Use CoreCardInstance instead */
export type Card<T extends GameSpecificCardDefinition = DefaultCardDefinition> =
  CoreCardInstance<T>;

/** @deprecated Use GameCard instead */
export type ContextCard<
  T extends GameSpecificCardDefinition = DefaultCardDefinition,
> = GameCard<T>;

// Filter aliases
/** @deprecated Use BaseCoreCardFilter instead */
export type CardFilter = BaseCoreCardFilter;

/** @deprecated Use CardFilterDSL from card-filtering.ts instead */
export type LegacyCardFilterDSL = CoreCardFilterDSL<any>;

// Game state aliases
/** @deprecated Use GameSpecificGameState instead */
export type GameState<G extends BaseGameState = DefaultGameState> = G;

/** @deprecated Use GameSpecificPlayerState instead */
export type PlayerState<P extends BasePlayerState = DefaultPlayerState> = P;

// Move aliases
/** @deprecated Use Move instead */
export type GameMove<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> = Move<G, CardDefinition, PlayerState, CardFilter, CardInstance>;

/** @deprecated Use MoveFn instead */
export type MoveFunction<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> = MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>;

// Context aliases
/** @deprecated Use CoreCtx instead */
export type GameContext = CoreCtx;

/** @deprecated Use FnContext instead */
export type MoveContext<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> = FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance>;

/** @deprecated Use ContextWithNextTurnPlayer from context-factory.ts instead */
export type NextTurnPlayerContext = CoreCtx;

/** @deprecated Use ContextWithPriorityPlayer from context-factory.ts instead */
export type PriorityPlayerContext = CoreCtx;

/** @deprecated Use ContextWithTurnPlayer from context-factory.ts instead */
export type TurnPlayerContext = CoreCtx;

// Game definition aliases
/** @deprecated Use GameDefinition instead */
export type Game<G = unknown> = GameDefinition<G>;

// Result aliases
/** @deprecated Use Result instead */
export type OperationResult<T, E = Error> = Result<T, E>;

// Utility function aliases
/** @deprecated Use getCardsByFilter from card-filtering.ts instead */
export type FilterCardsFunction = <
  T extends GameSpecificCardDefinition = DefaultCardDefinition,
>(
  filter: BaseCoreCardFilter,
  cards: CoreCardInstance<T>[],
) => CoreCardInstance<T>[];

/** @deprecated Use createContext from context-factory.ts instead */
export type CreateContextFunction = typeof import("../state/context").createCtx;

/** @deprecated Use createContextWithNextTurnPlayer from context-factory.ts instead */
export type CreateNextTurnPlayerContextFunction =
  typeof import("../utils/context-factory").createContextWithNextTurnPlayer;

/** @deprecated Use createContextWithPriorityPlayer from context-factory.ts instead */
export type CreatePriorityPlayerContextFunction =
  typeof import("../utils/context-factory").createContextWithPriorityPlayer;

/** @deprecated Use createContextWithTurnPlayer from context-factory.ts instead */
export type CreateTurnPlayerContextFunction =
  typeof import("../utils/context-factory").createContextWithTurnPlayer;
