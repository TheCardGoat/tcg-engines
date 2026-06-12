import type { CharacterCard } from "@tcg/lorcana-types";
import { blueFairyGuidingLightI18n } from "./071-blue-fairy-guiding-light.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { support } from "../../../helpers/abilities/support";

export const blueFairyGuidingLight: CharacterCard = {
  id: "IbB",
  canonicalId: "ci_IbB",
  reprints: ["set8-071"],
  cardType: "character",
  name: "Blue Fairy",
  version: "Guiding Light",
  inkType: ["amethyst", "sapphire"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b36358ea2e404178ab14c1815fce6bb5",
    tcgPlayer: 631398,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [evasive, support],
  i18n: blueFairyGuidingLightI18n,
};
