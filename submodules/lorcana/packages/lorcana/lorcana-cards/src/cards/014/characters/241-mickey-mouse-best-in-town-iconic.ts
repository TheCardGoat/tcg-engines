import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseBestInTownIconicI18n } from "./241-mickey-mouse-best-in-town-iconic.i18n";

export const mickeyMouseBestInTownIconic: CharacterCard = {
  id: "EDT",
  canonicalId: "ci_vC5",
  slug: "lorcana-ci_vC5",
  printings: [
    {
      id: "set14-241-iconic",
      artId: "ci_vC5-iconic",
      setCode: "set14",
      collectorNumber: "241",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set14-023"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Best in Town",
  inkType: ["amber"],
  set: "014",
  cardNumber: 241,
  rarity: "iconic",
  specialRarity: "iconic",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1ddaca55bb4f46acae8b17edfea186ac",
  },
  text: [
    {
      title: "Adventurous",
      description: "(This character can't challenge and must quest each turn if able.)",
    },
    {
      title: "HOT DOG!",
      description:
        "At the end of your turn, if this character is exerted, each player gets 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "vC5-1",
      name: "Adventurous",
      type: "static",
      text: "Adventurous (This character can't challenge and must quest each turn if able.)",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "SELF",
          },
          {
            type: "restriction",
            restriction: "must-quest",
            target: "SELF",
          },
        ],
      },
    },
    {
      id: "vC5-2",
      name: "HOT DOG!",
      type: "triggered",
      text: "HOT DOG! At the end of your turn, if this character is exerted, each player gets 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "EACH_PLAYER",
      },
    },
  ],
  i18n: mickeyMouseBestInTownIconicI18n,
};
