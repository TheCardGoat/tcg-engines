import type { CharacterCard } from "@tcg/lorcana-types";
import { camiloMadrigalPranksterI18n } from "./040-camilo-madrigal-prankster.i18n";

export const camiloMadrigalPrankster: CharacterCard = {
  id: "I0K",
  canonicalId: "ci_GAc",
  reprints: ["set4-040", "set9-052"],
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Prankster",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 40,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b07f766507574745ae00ade904bd2558",
    tcgPlayer: 649996,
  },
  text: [
    {
      title: "MANY FORMS",
      description: "At the start of your turn, you may choose one:",
    },
    {
      title: "• This character gets +1 {L} this turn.",
    },
    {
      title: "• This character gains Challenger +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "I0K-1",
      name: "MANY FORMS",
      text: "MANY FORMS At the start of your turn, you may choose one: • This character gets +1 {L} this turn. • This character gains Challenger +2 this turn.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        effect: {
          type: "choice",
          optionLabels: [
            "This character gets +1 lore this turn.",
            "This character gains Challenger +2 this turn.",
          ],
          options: [
            {
              type: "modify-stat",
              stat: "lore",
              modifier: 1,
              target: "SELF",
              duration: "this-turn",
            },
            {
              type: "gain-keyword",
              keyword: "Challenger",
              value: 2,
              target: "SELF",
              duration: "this-turn",
            },
          ],
        },
      },
    },
  ],
  i18n: camiloMadrigalPranksterI18n,
};
