import type { GundamitoCard } from "../cardTypes";
import {
  peacefulTimbre,
  simultaneousFireTrowaBarton,
} from "./commands/commands";
import { heeroYuy } from "./pilots/pilots";
import {
  maganacWMS03,
  wingGundamBirdModeST02002,
  wingGundamST02001,
} from "./units/unitis";

export const allCardsST02Cards: GundamitoCard[] = [
  peacefulTimbre,
  heeroYuy,
  simultaneousFireTrowaBarton,
  wingGundamST02001,
  wingGundamBirdModeST02002,
  maganacWMS03,
];
export const allCardsST02CardsById: Record<string, GundamitoCard> = {};
allCardsST02Cards.forEach((card) => {
  allCardsST02CardsById[card.id] = card;
});
