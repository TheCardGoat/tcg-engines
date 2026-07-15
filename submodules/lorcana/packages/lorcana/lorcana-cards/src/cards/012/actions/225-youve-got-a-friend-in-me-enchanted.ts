import type { ActionCard } from "@tcg/lorcana-types";
import { youveGotAFriendInMeEnchantedI18n } from "./225-youve-got-a-friend-in-me-enchanted.i18n";

export const youveGotAFriendInMeEnchanted: ActionCard = {
  id: "RGt",
  canonicalId: "ci_U0Y",
  slug: "lorcana-ci_U0Y",
  printings: [
    {
      id: "set12-225-enchanted",
      artId: "ci_U0Y-enchanted",
      setCode: "set12",
      collectorNumber: "225",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-030"],
  cardType: "action",
  name: "You've Got a Friend in Me",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_611ab7622d0b4aa7a9aa98ab736f329c",
    tcgPlayer: "690747",
  },
  text: "Look at the top 4 cards of your deck. You may reveal up to 2 Toy character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 4,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 2,
            reveal: true,
            filter: {
              type: "and",
              filters: [
                {
                  type: "card-type",
                  cardType: "character",
                },
                {
                  type: "classification",
                  classification: "Toy",
                },
              ],
            },
            label: "Hand (Toy character)",
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: youveGotAFriendInMeEnchantedI18n,
};
