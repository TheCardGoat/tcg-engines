import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseDaringDefenderI18n } from "./006-minnie-mouse-daring-defender.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const minnieMouseDaringDefender: CharacterCard = {
  id: "t5R",
  canonicalId: "ci_t5R",
  reprints: ["set8-006"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Daring Defender",
  inkType: ["amber", "ruby"],
  set: "008",
  cardNumber: 6,
  rarity: "rare",
  cost: 4,
  strength: 0,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_693ec0809a974a8ba6ce2a5b3a29f209",
    tcgPlayer: 631352,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "TRUE VALOR",
      description: "This character gets +1 {S} for each 1 damage on her.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    bodyguard,
    {
      effect: {
        modifier: {
          type: "damage-on-self",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "7k3-2",
      name: "TRUE VALOR",
      text: "TRUE VALOR This character gets +1 {S} for each 1 damage on her.",
      type: "static",
    },
  ],
  i18n: minnieMouseDaringDefenderI18n,
};
