import type { CharacterCard } from "@tcg/lorcana-types";
import { tweedledeeTweedledumStrangeStorytellersI18n } from "./103-tweedledee-tweedledum-strange-storytellers.i18n";

export const tweedledeeTweedledumStrangeStorytellers: CharacterCard = {
  id: "Myt",
  canonicalId: "ci_Myt",
  reprints: ["set7-103"],
  cardType: "character",
  name: "Tweedledee & Tweedledum",
  version: "Strange Storytellers",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 103,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f412907cdf7346cf8bbc1d02fab3d1d6",
    tcgPlayer: 619461,
  },
  text: [
    {
      title: "ANOTHER RECITATION",
      description:
        "Whenever this character quests, you may return chosen damaged character to their player's hand.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "damaged",
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1i9-1",
      name: "ANOTHER RECITATION",
      text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tweedledeeTweedledumStrangeStorytellersI18n,
};
