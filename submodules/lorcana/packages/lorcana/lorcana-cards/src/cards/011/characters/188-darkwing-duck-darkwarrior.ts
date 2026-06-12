import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckDarkwarriorI18n } from "./188-darkwing-duck-darkwarrior.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const darkwingDuckDarkwarrior: CharacterCard = {
  id: "8XU",
  canonicalId: "ci_8XU",
  reprints: ["set11-188"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Darkwarrior",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 188,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a74daac05bd643ce8913eec4fcbf2bdc",
    tcgPlayer: 676242,
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "INSTA-ARMOR",
      description:
        "During your turn, whenever an item is banished, this character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Super", "Detective"],
  abilities: [
    challenger(2),
    {
      id: "l0p-2",
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
        duration: "until-start-of-next-turn",
      },
      name: "INSTA-ARMOR",
      trigger: {
        event: "banish",
        on: "ANY_ITEM",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
      text: "INSTA-ARMOR During your turn, whenever an item is banished, this character gains Resist +1 until the start of your next turn.",
    },
  ],
  i18n: darkwingDuckDarkwarriorI18n,
};
