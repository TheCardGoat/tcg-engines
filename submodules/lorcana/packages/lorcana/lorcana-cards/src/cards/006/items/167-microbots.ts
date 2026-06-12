import type { ItemCard } from "@tcg/lorcana-types";
import { microbotsI18n } from "./167-microbots.i18n";

export const microbots: ItemCard = {
  id: "0HD",
  canonicalId: "ci_0HD",
  reprints: ["set6-167"],
  cardType: "item",
  name: "Microbots",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 167,
  rarity: "uncommon",
  cardCopyLimit: "no-limit",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb181c94e74a4e6e8983a33275b59f55",
    tcgPlayer: 588323,
  },
  text: [
    {
      title: "LIMITLESS APPLICATIONS",
      description: "You may have any number of cards named Microbots in your deck.",
    },
    {
      title: "INSPIRED TECH",
      description:
        "When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
    },
  ],
  abilities: [
    {
      id: "1f9-1",
      name: "INSPIRED TECH",
      text: "INSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
        modifier: {
          type: "filtered-count",
          multiplier: -1,
          owner: "you",
          zones: ["play"],
          cardType: "item",
          filters: [
            {
              type: "has-name",
              name: "Microbots",
            },
          ],
        },
      },
    },
  ],
  i18n: microbotsI18n,
};
