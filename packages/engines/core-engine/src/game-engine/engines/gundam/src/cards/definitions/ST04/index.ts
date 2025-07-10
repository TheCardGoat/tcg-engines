import type { GundamitoCard } from "../cardTypes";
import { archangel } from "./bases/bases";
import { hawkOfEndymion } from "./commands/commands";
import { aileStrikeGundam, strikeDaggerGAT1 } from "./units/units";

export const allCardsST04Cards: GundamitoCard[] = [
  archangel,
  hawkOfEndymion,
  aileStrikeGundam,
  strikeDaggerGAT1,
];
export const allCardsST04CardsById: Record<string, GundamitoCard> = {};
for (const card of allCardsST04Cards) {
  allCardsST04CardsById[card.id] = card;
}
