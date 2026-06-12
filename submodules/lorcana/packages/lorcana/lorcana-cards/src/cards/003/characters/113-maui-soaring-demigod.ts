import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiSoaringDemigodI18n } from "./113-maui-soaring-demigod.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const mauiSoaringDemigod: CharacterCard = {
  id: "IYc",
  canonicalId: "ci_IYc",
  reprints: ["set3-113"],
  cardType: "character",
  name: "Maui",
  version: "Soaring Demigod",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 113,
  rarity: "uncommon",
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_1b985f3a7a854505902294c666c69c34",
    tcgPlayer: 539090,
  },
  text: [
    {
      title: "Reckless",
    },
    {
      title: "IN MA BELLY",
      description:
        "Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [
    reckless,
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 1,
            stat: "lore",
            target: "SELF",
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            keyword: "Reckless",
            target: "SELF",
            type: "lose-keyword",
          },
        ],
        type: "sequence",
      },
      id: "q08-2",
      name: "IN MA BELLY",
      text: "IN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
      trigger: {
        event: "quest",
        on: {
          controller: "you",
          cardType: "character",
          name: "HeiHei",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mauiSoaringDemigodI18n,
};
