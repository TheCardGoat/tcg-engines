import type { CharacterCard } from "@tcg/lorcana-types";
import { peteGhostOfChristmasFutureI18n } from "./154-pete-ghost-of-christmas-future.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const peteGhostOfChristmasFuture: CharacterCard = {
  id: "0RS",
  canonicalId: "ci_0RS",
  reprints: ["set11-154"],
  cardType: "character",
  name: "Pete",
  version: "Ghost of Christmas Future",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 154,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cc4685ee359648a9b100d7a20c00ee5f",
    tcgPlayer: 672431,
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "FOREBODING GLANCE",
      description:
        "Whenever this character quests, look at a number of cards from the top of your deck equal to the number of cards under him. Put one into your hand and put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost"],
  abilities: [
    boost(1),
    {
      id: "12x-2",
      effect: {
        type: "scry",
        amount: {
          type: "source-attribute",
          attribute: "cards-under-them",
        },
        destinations: [
          { zone: "hand", max: 1 },
          { zone: "deck-bottom", remainder: true },
        ],
      },
      name: "FOREBODING GLANCE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "has-card-under",
      },
      type: "triggered",
      text: "FOREBODING GLANCE Whenever this character quests, look at a number of cards from the top of your deck equal to the number of cards under him. Put one into your hand and put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: peteGhostOfChristmasFutureI18n,
};
