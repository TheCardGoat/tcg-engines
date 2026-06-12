import type { CharacterCard } from "@tcg/lorcana-types";
import { adorabeezleWinterpopIceRocketRacerI18n } from "./116-adorabeezle-winterpop-ice-rocket-racer.i18n";

export const adorabeezleWinterpopIceRocketRacer: CharacterCard = {
  id: "cN0",
  canonicalId: "ci_cN0",
  reprints: ["set6-116"],
  cardType: "character",
  name: "Adorabeezle Winterpop",
  version: "Ice Rocket Racer",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 116,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7873f8596eef4066bc23325ceeedcfd8",
    tcgPlayer: 583721,
  },
  text: [
    {
      title: "KEEP DRIVING",
      description: "While this character has damage, she gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Racer"],
  abilities: [
    {
      condition: {
        type: "self-has-damage",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "zbp-1",
      name: "KEEP DRIVING",
      text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: adorabeezleWinterpopIceRocketRacerI18n,
};
