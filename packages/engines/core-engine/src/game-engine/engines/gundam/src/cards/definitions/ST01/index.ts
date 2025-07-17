import type { GundamitoCard } from "../cardTypes";
import { aShowOfResolve, kaisResolveKaiShiden } from "./commands/commands";
import { amuroRay, sulettaMercury } from "./pilots/pilots";
import {
  demiTrainer,
  gmRgm79,
  gundamAerialBitOnFormXVX016,
  gundamRx782,
} from "./units/units";

export const allCardsST01Cards: GundamitoCard[] = [
  aShowOfResolve,
  kaisResolveKaiShiden,
  amuroRay,
  sulettaMercury,
  gundamRx782,
  demiTrainer,
  gundamAerialBitOnFormXVX016,
  gmRgm79,
];

export const allCardsST01CardsById: Record<string, GundamitoCard> = {};
allCardsST01Cards.forEach((card) => {
  allCardsST01CardsById[card.id] = card;
});

// Units
export { card as ST01_1 } from "./units/1";
