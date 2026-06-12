import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesLookingForADealI18n } from "./056-hades-looking-for-a-deal.i18n";

export const hadesLookingForADeal: CharacterCard = {
  id: "bDq",
  canonicalId: "ci_yoK",
  reprints: ["set10-056"],
  cardType: "character",
  name: "Hades",
  version: "Looking for a Deal",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 56,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4656262d1cbc478aab92978dc7729663",
    tcgPlayer: 657889,
  },
  text: [
    {
      title: "WHAT D'YA SAY?",
      description:
        "When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      id: "qkg-1",
      name: "WHAT D'YA SAY?",
      text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: "CHOSEN_OPPOSING_CHARACTER",
            },
            {
              type: "choice",
              chooser: "OPPONENT",
              optionLabels: ["put that character on the bottom of their deck", "you draw 2 cards"],
              options: [
                {
                  type: "put-on-bottom",
                  target: {
                    ref: "previous-target",
                  },
                },
                {
                  type: "draw",
                  amount: 2,
                  target: "CONTROLLER",
                },
              ],
            },
          ],
        },
      },
    },
  ],
  i18n: hadesLookingForADealI18n,
};
