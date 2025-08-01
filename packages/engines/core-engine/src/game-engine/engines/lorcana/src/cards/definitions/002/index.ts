import {
  bibbidiBobbidiBoo,
  bounce,
  charge,
  fallingDownTheRabbitHole,
  fourDozenEggs,
  goTheDistance,
  gruesomeAndGrim,
  holdStill,
  hypnotize,
  improvise,
  imStuck,
  lastStand,
  launch,
  legendOfTheSwordInTheStone,
  letTheStormRageOn,
  nothingToHide,
  packTactics,
  paintingTheRosesRed,
  pickAFight,
  ringTheBell,
  strengthOfARagingFire,
  teethAndAmbitions,
  theMostDiabolicalScheme,
  whatDidYouCallMe,
  worldsGreatestCriminalMind,
  youCanFly,
  zeroToHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const allROFCards: LorcanaCardDefinition[] = [
  bibbidiBobbidiBoo,
  bounce,
  charge,
  fallingDownTheRabbitHole,
  fourDozenEggs,
  goTheDistance,
  gruesomeAndGrim,
  holdStill,
  hypnotize,
  improvise,
  imStuck,
  lastStand,
  launch,
  legendOfTheSwordInTheStone,
  letTheStormRageOn,
  nothingToHide,
  packTactics,
  paintingTheRosesRed,
  pickAFight,
  ringTheBell,
  strengthOfARagingFire,
  teethAndAmbitions,
  theMostDiabolicalScheme,
  whatDidYouCallMe,
  worldsGreatestCriminalMind,
  youCanFly,
  zeroToHero,
];

export const allROFCardsById: Record<string, LorcanaCardDefinition> = {};
for (const card of allROFCards) {
  allROFCardsById[card.id] = card;
}
