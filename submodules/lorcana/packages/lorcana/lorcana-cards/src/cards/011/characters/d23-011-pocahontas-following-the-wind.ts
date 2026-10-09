import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasFollowingTheWindD23I18n } from "./d23-011-pocahontas-following-the-wind.i18n";

export const pocahontasFollowingTheWindD23: CharacterCard = {
  id: "jHK",
  canonicalId: "ci_o0i",
  slug: "lorcana-ci_o0i",
  printings: [
    {
      id: "set11-d23-011",
      artId: "set11-d23-011",
      setCode: "set11",
      collectorNumber: "11",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set11-d23-011", "set11-042"],
  cardType: "character",
  name: "Pocahontas",
  version: "Following the Wind",
  inkType: ["amethyst"],
  franchise: "D23",
  set: "011",
  cardNumber: 11,
  rarity: "special",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_044b499eebfa487ea9fb1a43e8d5fcdb",
    tcgPlayer: "674700",
  },
  text: [
    {
      title: "What Is My Path?",
      description:
        "Whenever this character quests, gain lore equal to another chosen exerted character's {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "o0i-1",
      name: "WHAT IS MY PATH?",
      text: "WHAT IS MY PATH? Whenever this character quests, gain lore equal to another chosen exerted character's {L}.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "lore-value-of",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "exerted",
              },
            ],
            excludeSelf: true,
          },
        },
        target: "CONTROLLER",
      },
    },
  ],
  i18n: pocahontasFollowingTheWindD23I18n,
};
