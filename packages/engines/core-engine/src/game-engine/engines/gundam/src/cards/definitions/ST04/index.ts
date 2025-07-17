import type { GundamitoCard } from "../cardTypes";
import { archangel, vesalius } from "./bases/bases";
import {
  hawkOfEndymion,
  strikerPack,
  theMagicBulletOfDusk,
} from "./commands/commands";
import { athrunZala, kiraYamato } from "./pilots/pilots";
import {
  aegisGundam,
  aegisGundamMaMode,
  aileStrikeGundam,
  ginn,
  miguelsGinn,
  moebius,
  moebiusZero,
  strikeDagger,
  strikeGundam,
} from "./units/units";

export const allCardsST04Cards: GundamitoCard[] = [
  aileStrikeGundam,
  strikeGundam,
  moebiusZero,
  moebius,
  strikeDagger,
  aegisGundam,
  aegisGundamMaMode,
  ginn,
  miguelsGinn,
  kiraYamato,
  athrunZala,
  strikerPack,
  hawkOfEndymion,
  theMagicBulletOfDusk,
  archangel,
  vesalius,
];

export const allCardsST04CardsById: Record<string, GundamitoCard> = {};
allCardsST04Cards.forEach((card) => {
  allCardsST04CardsById[card.id] = card;
});
