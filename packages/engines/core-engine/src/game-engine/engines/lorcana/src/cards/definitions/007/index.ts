export * from "~/game-engine/engines/lorcana/src/cards/definitions/007/actions";

import {
  allIsFound,
  doubleTrouble,
  hesATramp,
  inkGeyser,
  magicalManeuvers,
  outOfOrder,
  restoringAtlantis,
  restoringTheCrown,
  restoringTheHeart,
  showMeMore,
  soMuchToGive,
  theFamilyMadrigal,
  theReturnOfHercules,
  thisIsMyFamily,
  wakeUpAlice,
  waterHasMemory,
  weveGotCompany,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/actions";
import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const edgarBalthazarAmbitiousButler = {
  id: "edgarBalthazarAmbitiousButler",
};
export const madHatterUnrulyEccentric = { id: "madHatterUnrulyEccentric" };
export const petePirateScoundrel = { id: "petePirateScoundrel" };
export const scroogeMcduckResourcefulMiser = {
  id: "scroogeMcduckResourcefulMiser",
};
export const yokaiIntellectualSchemer = { id: "yokaiIntellectualSchemer" };
export const moanaAdventurerOfLandAndSea = {
  id: "moanaAdventurerOfLandAndSea",
};
export const anastasiaBossyStepsister = { id: "anastasiaBossyStepsister" };
export const elsaTrustedSister = { id: "elsaTrustedSister" };
export const mufasaRespectedKing = { id: "mufasaRespectedKing" };
export const mufasaAmongTheStars = { id: "mufasaAmongTheStars" };

export const all007Cards: LorcanaCardDefinition[] = [
  allIsFound,
  doubleTrouble,
  hesATramp,
  inkGeyser,
  magicalManeuvers,
  outOfOrder,
  restoringAtlantis,
  restoringTheCrown,
  restoringTheHeart,
  showMeMore,
  soMuchToGive,
  theFamilyMadrigal,
  theReturnOfHercules,
  thisIsMyFamily,
  wakeUpAlice,
  waterHasMemory,
  weveGotCompany,
];

export const all007CardsById: Record<string, LorcanaCardDefinition> = {};
for (const card of all007Cards) {
  all007CardsById[card.id] = card;
}

// Minimal 007 character referenced by tests
export const thePhantomBlotShadowyFigure = {
  id: "thePhantomBlotShadowyFigure",
} as any;
