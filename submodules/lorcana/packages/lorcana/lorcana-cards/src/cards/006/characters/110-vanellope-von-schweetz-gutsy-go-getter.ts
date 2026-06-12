import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzGutsyGogetterI18n } from "./110-vanellope-von-schweetz-gutsy-go-getter.i18n";

export const vanellopeVonSchweetzGutsyGogetter: CharacterCard = {
  id: "xuX",
  canonicalId: "ci_xuX",
  reprints: ["set6-110"],
  cardType: "character",
  name: "Vanellope Von Schweetz",
  version: "Gutsy Go-Getter",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 110,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cfd767c1ed88437486b41bb5670ccc1c",
    tcgPlayer: 591981,
  },
  text: [
    {
      title: "AS READY AS I'LL EVER BE",
      description:
        "At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
  abilities: [
    {
      id: "ypp-1",
      name: "AS READY AS I'LL EVER BE",
      text: "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "at-location",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
      },
    },
  ],
  i18n: vanellopeVonSchweetzGutsyGogetterI18n,
};
