import type { CharacterCard } from "@tcg/lorcana-types";
import { mirageSuperRecruiterI18n } from "./053-mirage-super-recruiter.i18n";

export const mirageSuperRecruiter: CharacterCard = {
  id: "ipu",
  canonicalId: "ci_fio",
  slug: "lorcana-ci_fio",
  printings: [
    {
      id: "set12-053",
      artId: "set12-053",
      setCode: "set12",
      collectorNumber: "53",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-053"],
  cardType: "character",
  name: "Mirage",
  version: "Super Recruiter",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 53,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_31ae4e3c265448b894f74dcaf1914a3a",
    tcgPlayer: "692205",
  },
  text: [
    {
      title: "BUSINESS ARRANGEMENT",
      description:
        "When you play this character, if you have a Super or Hero character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "fio-1",
      name: "BUSINESS ARRANGEMENT",
      type: "triggered",
      text: "BUSINESS ARRANGEMENT When you play this character, if you have a Super or Hero character in play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "or",
        conditions: [
          {
            type: "has-character-with-classification",
            controller: "you",
            classification: "Super",
          },
          {
            type: "has-character-with-classification",
            controller: "you",
            classification: "Hero",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: mirageSuperRecruiterI18n,
};
