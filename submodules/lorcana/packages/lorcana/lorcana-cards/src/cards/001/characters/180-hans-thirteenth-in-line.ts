import type { CharacterCard } from "@tcg/lorcana-types";
import { hansThirteenthInLineI18n } from "./180-hans-thirteenth-in-line.i18n";

export const hansThirteenthInLine: CharacterCard = {
  id: "jUh",
  canonicalId: "ci_jUh",
  reprints: ["set1-180"],
  cardType: "character",
  name: "Hans",
  version: "Thirteenth in Line",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 180,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4fa7d5ae1044415e8ad8c609a527498c",
    tcgPlayer: 506823,
  },
  text: [
    {
      title: "STAGE A LITTLE ACCIDENT",
      description: "Whenever this character quests, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CHOSEN_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1ro-1",
      name: "STAGE A LITTLE ACCIDENT",
      text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hansThirteenthInLineI18n,
};
