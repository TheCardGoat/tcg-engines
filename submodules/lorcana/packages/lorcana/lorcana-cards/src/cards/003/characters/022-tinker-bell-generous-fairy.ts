import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellGenerousFairyI18n } from "./022-tinker-bell-generous-fairy.i18n";

export const tinkerBellGenerousFairy: CharacterCard = {
  id: "NlL",
  canonicalId: "ci_CV5",
  reprints: ["set3-022", "set9-012"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Generous Fairy",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 22,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_6ec58a64abf84ea2968667aa02d50769",
    tcgPlayer: 649961,
  },
  text: [
    {
      title: "MAKE A NEW FRIEND",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "character",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "e6y-1",
      name: "MAKE A NEW FRIEND",
      text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellGenerousFairyI18n,
};
