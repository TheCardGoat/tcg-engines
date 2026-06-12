import type { ItemCard } from "@tcg/lorcana-types";
import { lonelyGraveI18n } from "./132-lonely-grave.i18n";

export const lonelyGrave: ItemCard = {
  id: "zMB",
  canonicalId: "ci_zMB",
  reprints: ["set11-132"],
  cardType: "item",
  name: "Lonely Grave",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 132,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fb558452ff949e1ad997108b6f0ad06",
    tcgPlayer: 675345,
  },
  text: [
    {
      title: "HAUNTING PRESENCE",
      description:
        "{E}, Banish chosen character of yours — Put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  abilities: [
    {
      id: "1cz-1",
      name: "HAUNTING PRESENCE",
      type: "activated",
      cost: {
        exert: true,
        banishCharacter: true,
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: {
          cardTypes: ["character", "location"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              keyword: "Boost",
              type: "has-keyword",
            },
          ],
        },
      },
      text: "HAUNTING PRESENCE {E}, Banish chosen character of yours — Put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  i18n: lonelyGraveI18n,
};
