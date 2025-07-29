import {
  andThenAlongCameZeus,
  baBoom,
  bestowAGift,
  bosssOrders,
  distract,
  divebomb,
  friendLikeMe,
  healWhatHasBeenHurt,
  howFarIllGo,
  itCallsMe,
  iveGotADream,
  iWillFindMyWay,
  lastDitchEffort,
  NnPuppies,
  olympusWouldBeThatWay,
  onYourFeetNow,
  quickPatch,
  repair,
  riseOfTheTitans,
  strikeAGoodMatch,
  theBareNecessities,
  theBossIsOnARoll,
  touchedMyHeart,
  voyage,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const allITICards: LorcanaCardDefinition[] = [
  andThenAlongCameZeus,
  baBoom,
  bestowAGift,
  bosssOrders,
  distract,
  divebomb,
  friendLikeMe,
  healWhatHasBeenHurt,
  howFarIllGo,
  itCallsMe,
  iveGotADream,
  iWillFindMyWay,
  lastDitchEffort,
  NnPuppies,
  olympusWouldBeThatWay,
  onYourFeetNow,
  quickPatch,
  repair,
  riseOfTheTitans,
  strikeAGoodMatch,
  theBareNecessities,
  theBossIsOnARoll,
  touchedMyHeart,
  voyage,
];

export const allITICardsById: Record<string, LorcanaCardDefinition> = {};
for (const card of allITICards) {
  allITICardsById[card.id] = card;
}
