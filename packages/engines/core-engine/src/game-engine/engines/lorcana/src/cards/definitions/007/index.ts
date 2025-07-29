import type { LorcanitoCard } from "@lorcanito/lorcana-engine";

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

export const all007Cards: LorcanitoCard[] = [
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

export const all007CardsById: Record<string, LorcanitoCard> = {};
for (const card of all007Cards) {
  all007CardsById[card.id] = card;
}
