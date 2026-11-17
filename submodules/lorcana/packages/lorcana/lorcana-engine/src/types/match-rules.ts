/**
 * What happens when a player's deck runs out of cards.
 *
 * - `"lose"`: the normal rule (CR 1.8.1.2). A player whose turn ends with no
 *   cards in their deck loses the game.
 * - `"reshuffle-discard"`: Pack Rush (CR 10.2.5). The player doesn't lose;
 *   they shuffle their discard and it becomes their new deck.
 */
export type LorcanaEmptyDeckRule = "lose" | "reshuffle-discard";

/**
 * Cards put into each player's inkwell when the match is created, before
 * opening hands are drawn (Pack Rush, CR 10.2.2).
 */
export type LorcanaStartingInkwellRule =
  | {
      /** Take this many cards from the top of each player's shuffled deck. */
      source: "deck-top";
      count: number;
      /** CR 10.2.2.1-10.2.2.2: can't leave the inkwell and can't be chosen. Default `true`. */
      locked?: boolean;
    }
  | {
      /** Take these card instances (keyed by player id), which must be in that player's deck. */
      source: "card-ids";
      cardIds: Readonly<Record<string, readonly string[]>>;
      /** CR 10.2.2.1-10.2.2.2: can't leave the inkwell and can't be chosen. Default `true`. */
      locked?: boolean;
    };

/**
 * Match-level rule options set when a match is created.
 *
 * Every option is optional and defaults to the normal game, so a match created
 * without options (or with only default values) behaves exactly as before.
 * Pack Rush (CR 10.2) is `{ openingHandSize: 5, loreToWin: 15,
 * emptyDeck: "reshuffle-discard", startingInkwell: { ..., count: 2 } }`.
 */
export type LorcanaMatchRulesInput = {
  /** Cards each player draws for their opening hand. Default 7. */
  openingHandSize?: number;
  /**
   * Lore a player needs to win (CR 1.8.1.1). Default 20. Win-condition
   * modifications from cards still apply on top (the highest threshold wins).
   */
  loreToWin?: number;
  /** Default `"lose"`. */
  emptyDeck?: LorcanaEmptyDeckRule;
  /** Default: no starting inkwell. */
  startingInkwell?: LorcanaStartingInkwellRule;
};

/**
 * The match rules that affect play after setup, stored in `G.matchRules` so a
 * restored or replayed match keeps them. Only non-default values are stored.
 * The starting inkwell is applied once at creation; its card ids are never
 * stored in `G` (which every viewer receives), since inkwell cards are face down.
 */
export type LorcanaMatchRules = {
  openingHandSize?: number;
  loreToWin?: number;
  emptyDeck?: "reshuffle-discard";
};
