import type { CoreCardInstance } from "./card/core-card-instance";
import { CoreEngine } from "./engine/core-engine";

import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultCardMeta,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificCardMeta,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "./types/game-specific-types";

// Standard moves interface - all games must support
export interface StandardMoves {
  concede(playerId: string): any;
}

export abstract class GameEngine<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends GameSpecificCardMeta = DefaultCardMeta,
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> extends CoreEngine<
  GameState,
  CardDefinition,
  PlayerState,
  CardFilter,
  CardMeta,
  CardModel
> {}
