import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsOptimisticOfficerI18n } from "./152-judy-hopps-optimistic-officer.i18n";

export const judyHoppsOptimisticOfficer: CharacterCard = {
  id: "mSk",
  canonicalId: "ci_pT4",
  reprints: ["set2-152", "set9-157"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Optimistic Officer",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  cardNumber: 152,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb0a1c04d9ed4941a9cda16b55a05da9",
    tcgPlayer: 650092,
  },
  text: [
    {
      title: "DON'T CALL ME CUTE",
      description:
        "When you play this character, you may banish chosen item. Its player draws a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 1,
              target: "CARD_OWNER",
              type: "draw",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      id: "142-1",
      name: "DON'T CALL ME CUTE",
      text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: judyHoppsOptimisticOfficerI18n,
};
