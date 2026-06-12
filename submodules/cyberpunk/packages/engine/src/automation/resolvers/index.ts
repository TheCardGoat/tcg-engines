import type { ChoiceResolverMap } from "../types.ts";
import { searchDeckResolver } from "./search-deck.ts";
import { chooseTargetResolver } from "./choose-target.ts";
import { chooseEffectResolver } from "./choose-effect.ts";
import { chooseTriggerResolver } from "./choose-trigger.ts";
import { chooseGigsToStealResolver } from "./choose-gigs-to-steal.ts";
import { chooseCardToPlayResolver } from "./choose-card-to-play.ts";
import { chooseCardToMoveResolver } from "./choose-card-to-move.ts";
import { gainGigResolver } from "./gain-gig.ts";

/**
 * Shared decision tree for resolving every variant of a player-facing pending
 * choice. The map is typed as {@link ChoiceResolverMap}, which is a mapped
 * type over `PendingChoiceType` — TypeScript will refuse to compile this
 * object literal if a new pending-choice variant is added without a matching
 * entry here.
 */
export const defaultChoiceResolvers: ChoiceResolverMap = {
  searchDeck: searchDeckResolver,
  chooseTarget: chooseTargetResolver,
  chooseEffect: chooseEffectResolver,
  chooseTrigger: chooseTriggerResolver,
  chooseGigsToSteal: chooseGigsToStealResolver,
  chooseCardToPlay: chooseCardToPlayResolver,
  chooseCardToMove: chooseCardToMoveResolver,
  gainGig: gainGigResolver,
};

export {
  searchDeckResolver,
  chooseTargetResolver,
  chooseEffectResolver,
  chooseTriggerResolver,
  chooseGigsToStealResolver,
  chooseCardToPlayResolver,
  chooseCardToMoveResolver,
  gainGigResolver,
};
