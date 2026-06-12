import type { CharacterCard } from "@tcg/lorcana-types";
import { jimHawkinsStubbornCabinBoyI18n } from "./173-jim-hawkins-stubborn-cabin-boy.i18n";

export const jimHawkinsStubbornCabinBoy: CharacterCard = {
  id: "auV",
  canonicalId: "ci_auV",
  reprints: ["set6-173"],
  cardType: "character",
  name: "Jim Hawkins",
  version: "Stubborn Cabin Boy",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 173,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2b1ec76c46f4bc795726d2c2113e478",
    tcgPlayer: 593014,
  },
  text: [
    {
      title: "COME HERE, COME HERE, COME HERE!",
      description:
        "During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "tx8-1",
      name: "COME HERE, COME HERE, COME HERE!",
      text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: jimHawkinsStubbornCabinBoyI18n,
};
