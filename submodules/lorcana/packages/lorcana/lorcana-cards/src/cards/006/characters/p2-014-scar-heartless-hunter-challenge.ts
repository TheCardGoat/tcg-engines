import type { CharacterCard } from "@tcg/lorcana-types";
import { scarHeartlessHunterP2ChallengeI18n } from "./p2-014-scar-heartless-hunter-challenge.i18n";

export const scarHeartlessHunterP2Challenge: CharacterCard = {
  id: "2uW",
  canonicalId: "ci_Mty",
  slug: "lorcana-ci_Mty",
  printings: [
    {
      id: "set6-p2-014-challenge",
      artId: "ci_Mty-challenge",
      setCode: "set6",
      collectorNumber: "14",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-127"],
  cardType: "character",
  name: "Scar",
  version: "Heartless Hunter",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 14,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_eea9acebbeb6449a8cc03786f5bca24d",
    tcgPlayer: "591122",
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
  i18n: scarHeartlessHunterP2ChallengeI18n,
};
