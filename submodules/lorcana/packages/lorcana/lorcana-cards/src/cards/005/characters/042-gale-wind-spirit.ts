import type { CharacterCard } from "@tcg/lorcana-types";
import { galeWindSpiritI18n } from "./042-gale-wind-spirit.i18n";

export const galeWindSpirit: CharacterCard = {
  id: "Ds5",
  canonicalId: "ci_Ds5",
  reprints: ["set5-042"],
  cardType: "character",
  name: "Gale",
  version: "Wind Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 42,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a9888f3a8e1845588922ff69068e6f78",
    tcgPlayer: 561488,
  },
  text: [
    {
      title: "RECURRING GUST",
      description: "When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
      id: "1u4-1",
      name: "RECURRING GUST",
      text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: galeWindSpiritI18n,
};
