import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaRightfulKingI18n } from "./193-simba-rightful-king.i18n";

export const simbaRightfulKing: CharacterCard = {
  id: "Pp2",
  canonicalId: "ci_Pp2",
  reprints: ["set3-193"],
  cardType: "character",
  name: "Simba",
  version: "Rightful King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 193,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1985d10b104a4176a621275358537fa9",
    tcgPlayer: 535636,
  },
  text: [
    {
      title: "TRIUMPHANT STANCE",
      description:
        "During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "King"],
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "their-next-turn",
        type: "restriction",
      },
      id: "1nc-1",
      name: "TRIUMPHANT STANCE",
      text: "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: simbaRightfulKingI18n,
};
