import type { CharacterCard } from "@tcg/lorcana-types";
import { goofySuperGoofI18n } from "./107-goofy-super-goof.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const goofySuperGoof: CharacterCard = {
  id: "FBH",
  canonicalId: "ci_EA0",
  reprints: ["set4-107"],
  cardType: "character",
  name: "Goofy",
  version: "Super Goof",
  inkType: ["ruby"],
  set: "004",
  cardNumber: 107,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3088ee50256240d0b22c045f593df9a8",
    tcgPlayer: 550542,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "SUPER PEANUT POWERS",
      description: "Whenever this character challenges another character, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    rush,
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1n2-2",
      name: "SUPER PEANUT POWERS",
      text: "SUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
      trigger: {
        defender: {},
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofySuperGoofI18n,
};
