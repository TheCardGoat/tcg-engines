import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarHighSultanOfLorcanaI18n } from "./074-jafar-high-sultan-of-lorcana.i18n";

export const jafarHighSultanOfLorcana: CharacterCard = {
  id: "i56",
  canonicalId: "ci_i56",
  reprints: ["set8-074"],
  cardType: "character",
  name: "Jafar",
  version: "High Sultan of Lorcana",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 74,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_30ee33dee0c64851bcdcc676e724a787",
    tcgPlayer: 631400,
  },
  text: [
    {
      title: "DARK POWER",
      description:
        "Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "King", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              condition: {
                type: "discarded-card-has-classification",
                classification: "Illusion",
                cardType: "character",
              },
              then: {
                chooser: "CONTROLLER",
                effect: {
                  cost: "free",
                  from: "discard",
                  type: "play-card",
                },
                type: "optional",
              },
              type: "conditional",
            },
          ],
        },
        type: "optional",
      },
      id: "mfw-1",
      name: "DARK POWER",
      text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jafarHighSultanOfLorcanaI18n,
};
