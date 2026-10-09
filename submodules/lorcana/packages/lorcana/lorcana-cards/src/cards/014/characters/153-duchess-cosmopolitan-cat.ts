import type { CharacterCard } from "@tcg/lorcana-types";
import { duchessCosmopolitanCatI18n } from "./153-duchess-cosmopolitan-cat.i18n";

export const duchessCosmopolitanCat: CharacterCard = {
  id: "o4Z",
  canonicalId: "ci_o4Z",
  slug: "lorcana-ci_o4Z",
  printings: [
    {
      id: "set14-153",
      artId: "set14-153",
      setCode: "set14",
      collectorNumber: "153",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-153"],
  cardType: "character",
  name: "Duchess",
  version: "Cosmopolitan Cat",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 153,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2252afcd4e864c989912035aa9591f1f",
  },
  text: [
    {
      title: "UPPER CRUST",
      description:
        "While you have a character in play with the highest cost, or tied for highest cost, this character gets +1 {L}.",
    },
    {
      title: "PROPER ETIQUETTE",
      description:
        "Whenever this character quests, look at the top card of your deck. Put that card on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "duchess-1",
      name: "UPPER CRUST",
      type: "static",
      text: "UPPER CRUST While you have a character in play with the highest cost, or tied for highest cost, this character gets +1 {L}.",
      condition: {
        type: "has-character-with-highest-cost",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
    {
      id: "duchess-2",
      name: "PROPER ETIQUETTE",
      type: "triggered",
      text: "PROPER ETIQUETTE Whenever this character quests, look at the top card of your deck. Put that card on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            max: 1,
          },
          {
            zone: "deck-bottom",
            max: 1,
          },
        ],
      },
    },
  ],
  i18n: duchessCosmopolitanCatI18n,
};
