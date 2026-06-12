import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomIlluminaryKeeperI18n } from "./048-magic-broom-illuminary-keeper.i18n";

export const magicBroomIlluminaryKeeper: CharacterCard = {
  id: "9H2",
  canonicalId: "ci_9H2",
  reprints: ["set4-048"],
  cardType: "character",
  name: "Magic Broom",
  version: "Illuminary Keeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 48,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_65f55cf2eedd49668ac8946ebd4d2105",
    tcgPlayer: 549715,
  },
  text: [
    {
      title: "NICE AND TIDY",
      description:
        "Whenever you play another character, you may banish this character to draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                selector: "self",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "banish",
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      id: "1ct-1",
      name: "NICE AND TIDY",
      text: "NICE AND TIDY Whenever you play another character, you may banish this character to draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: magicBroomIlluminaryKeeperI18n,
};
