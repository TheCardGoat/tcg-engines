import type { CharacterCard } from "@tcg/lorcana-types";
import { gosalynMallardCuriousChildI18n } from "./149-gosalyn-mallard-curious-child.i18n";

export const gosalynMallardCuriousChild: CharacterCard = {
  id: "wv3",
  canonicalId: "ci_wv3",
  reprints: ["set11-149"],
  cardType: "character",
  name: "Gosalyn Mallard",
  version: "Curious Child",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 149,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dc802d9673ac4bd3ae7f6976a4faae09",
    tcgPlayer: 677137,
  },
  text: [
    {
      title: "KEEN GEAR",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "agy-1",
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
              cardType: "item",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      name: "KEEN GEAR",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "KEEN GEAR When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: gosalynMallardCuriousChildI18n,
};
