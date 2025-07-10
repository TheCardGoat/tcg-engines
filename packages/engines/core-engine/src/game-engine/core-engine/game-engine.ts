import type { CoreCardInstance } from "./card/core-card-instance";
import { CoreEngine } from "./engine/core-engine";

import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
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
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> extends CoreEngine<
  GameState,
  CardDefinition,
  PlayerState,
  CardFilter,
  CardModel
> {}
