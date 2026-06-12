import type { ActionCard } from "@tcg/lorcana-types";
import { theIslandsIPulledFromTheSeaI18n } from "./130-the-islands-i-pulled-from-the-sea.i18n";

export const theIslandsIPulledFromTheSea: ActionCard = {
  id: "O9N",
  canonicalId: "ci_qzk",
  reprints: ["set6-130"],
  cardType: "action",
  name: "The Islands I Pulled from the Sea",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_37f652aa15934d2b9bd7ad15eb18bbfb",
    tcgPlayer: 592000,
  },
  text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        cardType: "location",
        putInto: "hand",
        reveal: true,
        shuffle: true,
        type: "search-deck",
      },
      id: "pm0-1",
      text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
      type: "action",
    },
  ],
  i18n: theIslandsIPulledFromTheSeaI18n,
};
