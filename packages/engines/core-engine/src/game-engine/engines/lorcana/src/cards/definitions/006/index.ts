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

export const microbots = { id: "microbots" };
export const yokaiScientificSupervillain = {
  id: "yokaiScientificSupervillain",
};
export const mauiHalfshark = { id: "mauiHalfshark" };
export const jimHawkinsRiggerSpecialist = { id: "jimHawkinsRiggerSpecialist" };
export const gadgetHackwrenchPerceptiveMouse = {
  id: "gadgetHackwrenchPerceptiveMouse",
};
export const nickWildeCleverFox = { id: "nickWildeCleverFox" };
export const mammaOdieLoneSage = { id: "mammaOdieLoneSage" };
export const owlPirateLookout = { id: "owlPirateLookout" };
export const goofyExpertShipwright = { id: "goofyExpertShipwright" };
export const principeNaveenCarefreeExplorer = {
  id: "principeNaveenCarefreeExplorer",
};
export const simbaHappygolucky = { id: "simbaHappygolucky" };
export const sugarRushSpeedwayFinishLine = {
  id: "sugarRushSpeedwayFinishLine",
};

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
