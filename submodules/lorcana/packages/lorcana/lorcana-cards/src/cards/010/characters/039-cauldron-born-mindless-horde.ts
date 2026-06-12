import type { CharacterCard } from "@tcg/lorcana-types";
import { cauldronBornMindlessHordeI18n } from "./039-cauldron-born-mindless-horde.i18n";

export const cauldronBornMindlessHorde: CharacterCard = {
  id: "Fjd",
  canonicalId: "ci_Fjd",
  reprints: ["set10-039"],
  cardType: "character",
  name: "Cauldron Born",
  version: "Mindless Horde",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 39,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3675f8f0ce8e461e8bd1e3f89a63d590",
    tcgPlayer: 659446,
  },
  classifications: ["Storyborn"],
  i18n: cauldronBornMindlessHordeI18n,
};
