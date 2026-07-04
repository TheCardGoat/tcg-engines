import type { CharacterCard } from "@tcg/lorcana-types";
import { fflewddurFflamLucklessBardI18n } from "./038-fflewddur-fflam-luckless-bard.i18n";

export const fflewddurFflamLucklessBard: CharacterCard = {
  id: "ZZG",
  canonicalId: "ci_ZZG",
  slug: "lorcana-ci_ZZG",
  printings: [
    {
      id: "set13-038",
      artId: "set13-038",
      setCode: "set13",
      collectorNumber: "38",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-038"],
  cardType: "character",
  name: "Fflewddur Fflam",
  version: "Luckless Bard",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "013",
  cardNumber: 38,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Chasing Adventure",
      description:
        "When you play this character, if a character of yours quested this turn, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "CHASING ADVENTURE",
      text: "CHASING ADVENTURE When you play this character, if a character of yours quested this turn, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "quested-characters",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: fflewddurFflamLucklessBardI18n,
};
