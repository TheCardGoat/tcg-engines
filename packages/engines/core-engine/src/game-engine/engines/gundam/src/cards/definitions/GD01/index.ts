import type { GundamitoCard } from "../cardTypes";
import { side7 } from "./bases/bases";
import {
  firstContact,
  interceptOrders,
  overflowingAffection,
  takeAStandCitizens,
  theWitchAndTheBride,
} from "./commands/commands";
import { banagherLinks } from "./pilots/pilots";
import {
  ballRB79,
  charsZakuIIMS065,
  darilbaldeMD0064,
  gelgoogMS14S,
  guncacconRx77,
  gundamAerialXVX016,
  gundamHeavyarmsXXXG01H,
  gundamRx782,
  gundamSandrockXXXG01SR,
  laucherStrikeGundamGATX105,
  lotoD50C,
  michaelisCFK029,
  rickDomMS09R,
  shenlongGundamXXXG01S,
  strikeDaggerGATX105,
  unicornGundamRx0,
  wingGundamXXX01W,
} from "./units/units";

export const allCardsGD01Cards: GundamitoCard[] = [
  firstContact,
  takeAStandCitizens,
  overflowingAffection,
  theWitchAndTheBride,
  interceptOrders,
  shenlongGundamXXXG01S,
  gundamRx782,
  michaelisCFK029,
  gundamHeavyarmsXXXG01H,
  gundamSandrockXXXG01SR,
  ballRB79,
  charsZakuIIMS065,
  gundamAerialXVX016,
  laucherStrikeGundamGATX105,
  rickDomMS09R,
  darilbaldeMD0064,
  strikeDaggerGATX105,
  wingGundamXXX01W,
  gelgoogMS14S,
  lotoD50C,
  guncacconRx77,
  unicornGundamRx0,
  banagherLinks,
  side7,
];

export const allCardsGD01CardsById: Record<string, GundamitoCard> = {};
for (const card of allCardsGD01Cards) {
  allCardsGD01CardsById[card.id] = card;
}
