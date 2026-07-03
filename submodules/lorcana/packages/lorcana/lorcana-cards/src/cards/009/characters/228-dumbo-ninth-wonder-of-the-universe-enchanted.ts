import type { CharacterCard } from "@tcg/lorcana-types";
import { dumboNinthWonderOfTheUniverseEnchantedI18n } from "./228-dumbo-ninth-wonder-of-the-universe-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const dumboNinthWonderOfTheUniverseEnchanted: CharacterCard = {
  id: "ZwA",
  canonicalId: "ci_hTe",
  slug: "lorcana-ci_hTe",
  printings: [
    {
      id: "set9-228-enchanted",
      artId: "ci_hTe-enchanted",
      setCode: "set9",
      collectorNumber: "228",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-045"],
  cardType: "character",
  name: "Dumbo",
  version: "Ninth Wonder of the Universe",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa13ad9fe176464bac51e72c45dd6914",
    tcgPlayer: "651119",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "BREAKING RECORDS",
      description: "{E}, 1 {I} — Draw a card and gain 1 lore.",
    },
    {
      title: "MAKING HISTORY",
      description:
        'Your other characters with Evasive gain "{E}, 1 {I} — Draw a card and gain 1 lore."',
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    evasive,
    {
      id: "181-2",
      name: "BREAKING RECORDS",
      text: "BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
    },
    {
      id: "181-3",
      name: "MAKING HISTORY",
      text: 'MAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
      type: "static",
      effect: {
        type: "grant-abilities-while-here",
        target: "YOUR_OTHER_EVASIVE_CHARACTERS",
        abilities: [
          {
            id: "181-3a",
            name: "BREAKING RECORDS",
            text: "{E}, 1 {I} – Draw a card and gain 1 lore.",
            type: "activated",
            cost: {
              exert: true,
              ink: 1,
            },
            effect: {
              steps: [
                {
                  amount: 1,
                  target: "CONTROLLER",
                  type: "draw",
                },
                {
                  amount: 1,
                  type: "gain-lore",
                },
              ],
              type: "sequence",
            },
          },
        ],
      },
    },
  ],
  i18n: dumboNinthWonderOfTheUniverseEnchantedI18n,
};
