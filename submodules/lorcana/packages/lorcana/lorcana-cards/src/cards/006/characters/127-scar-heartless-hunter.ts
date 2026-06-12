import type { CharacterCard } from "@tcg/lorcana-types";
import { scarHeartlessHunterI18n } from "./127-scar-heartless-hunter.i18n";

export const scarHeartlessHunter: CharacterCard = {
  id: "YvX",
  canonicalId: "ci_YvX",
  reprints: ["set6-127"],
  cardType: "character",
  name: "Scar",
  version: "Heartless Hunter",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 127,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_eea9acebbeb6449a8cc03786f5bca24d",
    tcgPlayer: 591122,
  },
  text: [
    {
      title: "BARED TEETH",
      description:
        "When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 2,
            type: "deal-damage",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 2,
              type: "deal-damage",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      },
      id: "mp6-1",
      name: "BARED TEETH",
      text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scarHeartlessHunterI18n,
};
