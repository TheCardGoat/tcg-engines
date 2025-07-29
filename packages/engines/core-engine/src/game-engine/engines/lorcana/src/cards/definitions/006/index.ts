import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export * from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

import {
  ambush,
  aVeryMerryUnbirthday,
  energyBlast,
  goodJob,
  heffalumpsAndWoozles,
  helpingHand,
  hotPotato,
  imStillHere,
  iWontGiveIn,
  loseTheWay,
  makeSomeMagic,
  mosquitoBite,
  prepareToBoard,
  prepareYourBot,
  rescueRangersAway,
  safeAndSound,
  sailTheAzuriteSea,
  seekingTheHalfCrown,
  showTheWay,
  submitToMyWill,
  theIslandsIPulledFromTheSea,
  thievery,
  twinFire,
  unfortunateSituation,
  weCouldBeImmortals,
  youCameBack,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

export const all006Cards: LorcanaCardDefinition[] = [
  ambush,
  aVeryMerryUnbirthday,
  energyBlast,
  goodJob,
  heffalumpsAndWoozles,
  helpingHand,
  hotPotato,
  imStillHere,
  iWontGiveIn,
  loseTheWay,
  makeSomeMagic,
  mosquitoBite,
  prepareToBoard,
  prepareYourBot,
  rescueRangersAway,
  safeAndSound,
  sailTheAzuriteSea,
  seekingTheHalfCrown,
  showTheWay,
  submitToMyWill,
  theIslandsIPulledFromTheSea,
  thievery,
  twinFire,
  unfortunateSituation,
  weCouldBeImmortals,
  youCameBack,
];

export const all006CardsById: Record<string, LorcanaCardDefinition> = {};
for (const card of all006Cards) {
  all006CardsById[card.id] = card;
}
