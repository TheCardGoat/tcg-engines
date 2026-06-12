import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonArrogantShowoffI18n } from "./129-gaston-arrogant-showoff.i18n";

export const gastonArrogantShowoff: CharacterCard = {
  id: "Ooh",
  canonicalId: "ci_Ooh",
  reprints: ["set8-129"],
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Showoff",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 129,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e17eaad60a343068204ccdf776daa36",
    tcgPlayer: 632687,
  },
  text: [
    {
      title: "BREAK APART",
      description:
        "When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
              type: "banish",
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                duration: "this-turn",
                modifier: 2,
                stat: "strength",
                target: "CHOSEN_CHARACTER",
                type: "modify-stat",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "is0-1",
      name: "BREAK APART",
      text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gastonArrogantShowoffI18n,
};
