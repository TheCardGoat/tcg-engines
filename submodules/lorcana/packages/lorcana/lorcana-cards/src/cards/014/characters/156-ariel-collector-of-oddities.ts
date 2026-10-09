import type { CharacterCard } from "@tcg/lorcana-types";
import { arielCollectorOfOdditiesI18n } from "./156-ariel-collector-of-oddities.i18n";

export const arielCollectorOfOddities: CharacterCard = {
  id: "1wB",
  canonicalId: "ci_1wB",
  slug: "lorcana-ci_1wB",
  printings: [
    {
      id: "set14-156",
      artId: "set14-156",
      setCode: "set14",
      collectorNumber: "156",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-156"],
  cardType: "character",
  name: "Ariel",
  version: "Collector of Oddities",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "014",
  cardNumber: 156,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "One of a Kind",
      description:
        "Whenever you play an item, if the item you played has a different name than each other item you have in play, draw a card.",
    },
    {
      title: "Personal Collection",
      description:
        "For each item with a different name you have in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "ariel-1",
      name: "One of a Kind",
      type: "triggered",
      text: "One of a Kind Whenever you play an item, if the item you played has a different name than each other item you have in play, draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "played-card-name",
        zone: "play",
        cardTypes: ["item"],
        excludeSelf: true,
        requireAbsent: true,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "ariel-2",
      name: "Personal Collection",
      type: "static",
      text: "Personal Collection For each item with a different name you have in play, this character gets +1 {L}.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "count",
          what: "distinct-item-names-in-play",
          controller: "you",
        },
        target: "SELF",
      },
    },
  ],
  i18n: arielCollectorOfOdditiesI18n,
};
