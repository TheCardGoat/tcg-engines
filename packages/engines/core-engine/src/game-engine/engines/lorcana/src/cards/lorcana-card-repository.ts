import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { LorcanaAbility } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { allCardsById } from "~/game-engine/engines/lorcana/src/cards/definitions/cards";

export type CardColor =
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

export type Characteristics =
  | "location"
  | "mage"
  | "song"
  | "madrigal"
  | "racer"
  | "robot"
  | "action"
  | "hyena"
  | "item"
  | "villain"
  | "knight"
  | "dragon"
  | "illusion"
  | "tigger"
  | "seven dwarfs"
  | "pirate"
  | "detective"
  | "sorcerer"
  | "queen"
  | "puppy"
  | "titan"
  | "alien"
  | "king"
  | "mentor"
  | "inventor"
  | "fairy"
  | "captain"
  | "hero"
  | "prince"
  | "storyborn"
  | "floodborn"
  | "dreamborn"
  | "broom"
  | "ally"
  | "princess"
  | "musketeer"
  | "deity";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary";

type LorcanaBaseCardDefinition = {
  type: "character" | "item" | "action" | "location";
  reprints?: string[];
  missingTestCase?: true;
  notImplemented?: true;
  id: string;
  name: string;
  text?: string;
  flavour?: string;
  set: "TFC" | "ROF" | "ITI" | "URR" | "SSK" | "006" | "007" | "008" | "009";
  cost: number;
  colors: CardColor[];
  number: number;
  illustrator: string;
  inkwell?: boolean;
  characteristics: Array<Characteristics>;
  abilities?: LorcanaAbility[];
  rarity: CardRarity;
  // Adding this for simplicity
  strength?: number;
  lore?: number;
  willpower?: number;
  title?: string;
  moveCost?: number;
  movementDiscounts?: {
    // filters: TargetFilter[];
    // amount: number;
  }[];
  cardCopyLimit?: number | "no-limit";
};

// 6.5. Locations
// 6.5.1. Locations are a type of card that can be in play. A location is a location while in the Play zone; in all other zones it’s a location card.
// 6.5.2. Classification – A location is defined as having Location on the card’s classification line. Locations are the only card type that is printed in landscape (i.e., with the longer sides on the top and bottom). (See #2 on the diagram under 6.5.)
// 6.5.3. Cost – A location’s cost is in a different place on the card than the cost of other card types, but it works the same way. (See #1 on the diagram under 6.5.)
// 6.5.4. Move Cost – A location has a move cost. This is the amount of ink needed to move a character to this location. (See #3 on the diagram under 6.5.)
// 6.5.5. Willpower – Damage on a location is persistent, which means it accumulates over the course of the game. If a location has damage equal to or higher than its Willpower {W}, it’s banished as a required action. Note that locations don’t have a Strength {S} characteristic and don’t deal damage. (See #4 on the diagram under 6.5.)
// 6.5.6. Lore Value – A location may have a Lore value {L}, which is how much lore its player gains at the start of their turn during the Set step. (See #6 on the diagram under 6.5.)
// 6.5.7. Abilities – If a location has an ability, that ability can be used during the turn the location is played. (See #5 on the diagram under 6.5.)
export interface LorcanaLocationCardDefinition
  extends LorcanaBaseCardDefinition {
  type: "location";
  title: string;
  lore?: number;
  moveCost: number;
  willpower: number;
  strength?: never;
}

export interface LorcanaCharacterCardDefinition
  extends LorcanaBaseCardDefinition {
  type: "character";
  title: string;
  lore: number;
  strength: number;
  cost: number;
  willpower: number;
  additionalNames?: string[];
}

// 6.3. Actions
// 6.3.1. Actions are a type of card that can be played but can’t be in play. An action is an action while being played; otherwise, it’s an action card.
// 6.3.1.1. An action is defined as having Action on the card’s classification line.
// 6.3.1.2. Actions are played from a player’s hand, but they’re not considered in play. An effect from an action doesn’t enter the bag. (See 8.7, Bag.)
// 6.3.2. Effects – Actions have effects rather than abilities.
// 6.3.3. Songs
// 6.3.3.1. Songs are actions that have a special rule in addition to the normal rules for actions (see 6.3.3.3).
// 6.3.3.2. A song is defined as having Action and Song on the card’s classification line.
// 6.3.3.3. All songs allow the player to pay an alternate cost instead of their ink cost to play them. Being a song means Instead of paying the ink cost of this card, you can {E} one of your characters in play with ink cost N or greater to play this card for free. This is called singing the song.
// 6.3.3.4. Some songs also have the keyword Sing Together, which functions similarly to the special rule. (See 10.10, Sing Together.)
// 6.3.3.5. The standard reminder text for a song is (A character with cost N or more can {E} to sing this song for free.)
// 6.3.4. Any effect that’s triggered because of an action being played is placed in the bag and will resolve after the effects of the action are fully resolved.
export interface LorcanaActionCardDefinition extends LorcanaBaseCardDefinition {
  type: "action";
  title?: never;
}

// 6.4. Items
// 6.4.1. Items are a type of card that can be in play. An item is an item only while in the Play zone; in all other zones it’s an item card.
// 6.4.2. An item is defined as having Item on the card’s classification line.
// 6.4.3. If an item has an ability, that ability can be used during the turn the item is played.
export interface LorcanaItemCardDefinition extends LorcanaBaseCardDefinition {
  type: "item";
  title?: never;
}

export type LorcanaCardDefinition =
  | LorcanaItemCardDefinition
  | LorcanaActionCardDefinition
  | LorcanaCharacterCardDefinition
  | LorcanaLocationCardDefinition;

export class LorcanaCardRepository extends CardRepository<LorcanaCardDefinition> {
  constructor(dictionary: GameCards) {
    // TODO: Remove this once we have redefined card abilities
    super(dictionary, allCardsById as Record<string, LorcanaCardDefinition>, {
      validateDuplicates: true,
      errorPrefix: "LorcanaCardRepository",
    });
  }

  /**
   * Lorcana-specific helper methods
   */

  /**
   * Get cards by Lorcana-specific properties
   */
  getCardsByType(type: string): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => card.type === type,
    );
  }

  /**
   * Get cards by color
   */
  getCardsByColor(color: string): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter((card) =>
      card.colors?.includes(color as any),
    );
  }

  /**
   * Get cards with inkwell symbol
   */
  getInkwellCards(): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter((card) => card.inkwell);
  }

  /**
   * Get cards by cost range
   */
  getCardsByCostRange(
    minCost: number,
    maxCost: number,
  ): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => card.cost >= minCost && card.cost <= maxCost,
    );
  }
}
