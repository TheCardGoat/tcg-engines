import type { ChoiceResolverMap } from "../types.ts";
import { scryResolver } from "./scry.ts";
import { chooseTargetResolver } from "./choose-target.ts";
import { chooseEffectResolver } from "./choose-effect.ts";
import { chooseTriggerResolver } from "./choose-trigger.ts";
import { chooseGigsToStealResolver } from "./choose-gigs-to-steal.ts";
import { preventGigStealResolver } from "./prevent-gig-steal.ts";
import { chooseCardToPlayResolver } from "./choose-card-to-play.ts";
import { chooseCardToMoveResolver } from "./choose-card-to-move.ts";
import { chooseCardTypeResolver } from "./choose-card-type.ts";
import { gainGigResolver } from "./gain-gig.ts";
import { revealDestinationResolver } from "./reveal-destination.ts";
import { redirectDefeatResolver } from "./redirect-defeat.ts";
import { chooseSacrificialGearResolver } from "./sacrificial-gear.ts";
import { chooseFirstPlayerResolver } from "./choose-first-player.ts";

/**
 * Shared decision tree for resolving every variant of a player-facing pending
 * choice. The map is typed as {@link ChoiceResolverMap}, which is a mapped
 * type over `PendingChoiceType` — TypeScript will refuse to compile this
 * object literal if a new pending-choice variant is added without a matching
 * entry here.
 */
export const defaultChoiceResolvers: ChoiceResolverMap = {
  scry: scryResolver,
  revealDestination: revealDestinationResolver,
  chooseTarget: chooseTargetResolver,
  chooseEffect: chooseEffectResolver,
  chooseTrigger: chooseTriggerResolver,
  chooseGigsToSteal: chooseGigsToStealResolver,
  preventGigSteal: preventGigStealResolver,
  chooseCardToPlay: chooseCardToPlayResolver,
  chooseCardToMove: chooseCardToMoveResolver,
  chooseCardType: chooseCardTypeResolver,
  gainGig: gainGigResolver,
  redirectDefeat: redirectDefeatResolver,
  chooseSacrificialGear: chooseSacrificialGearResolver,
  chooseFirstPlayer: chooseFirstPlayerResolver,
};

export {
  scryResolver,
  revealDestinationResolver,
  chooseTargetResolver,
  chooseEffectResolver,
  chooseTriggerResolver,
  chooseGigsToStealResolver,
  preventGigStealResolver,
  chooseCardToPlayResolver,
  chooseCardToMoveResolver,
  chooseCardTypeResolver,
  gainGigResolver,
  redirectDefeatResolver,
  chooseSacrificialGearResolver,
  chooseFirstPlayerResolver,
};
