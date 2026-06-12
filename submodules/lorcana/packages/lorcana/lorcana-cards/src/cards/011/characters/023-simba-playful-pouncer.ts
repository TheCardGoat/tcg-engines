import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaPlayfulPouncerI18n } from "./023-simba-playful-pouncer.i18n";

export const simbaPlayfulPouncer: CharacterCard = {
  id: "ymd",
  canonicalId: "ci_ymd",
  reprints: ["set11-023"],
  cardType: "character",
  name: "Simba",
  version: "Playful Pouncer",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "011",
  cardNumber: 23,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9a221a16584b472c8bdec14c1b4ae5b8",
    tcgPlayer: 674317,
  },
  text: [
    {
      title: "YOU DON'T STAND A CHANCE",
      description:
        "When you play this character, chosen opposing character gets -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "11n-1",
      effect: {
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
        duration: "until-start-of-next-turn",
      },
      name: "YOU DON’T STAND A CHANCE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "YOU DON’T STAND A CHANCE When you play this character, chosen opposing character gets -2 {S} until the start of your next turn.",
    },
  ],
  i18n: simbaPlayfulPouncerI18n,
};
