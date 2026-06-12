import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities/support";
import { eilonwyPrincessOfLlyrI18n } from "./007-eilonwy-princess-of-llyr.i18n";

export const eilonwyPrincessOfLlyr: CharacterCard = {
  id: "B00",
  canonicalId: "ci_B00",
  reprints: ["set10-007"],
  cardType: "character",
  name: "Eilonwy",
  version: "Princess of Llyr",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 7,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_495426e5c16b4039977439b3c7a9b9e2",
    tcgPlayer: 659763,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally", "Princess"],
  abilities: [support],
  i18n: eilonwyPrincessOfLlyrI18n,
};
