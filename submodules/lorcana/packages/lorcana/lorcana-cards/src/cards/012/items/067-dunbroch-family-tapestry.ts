import type { ItemCard } from "@tcg/lorcana-types";
import { dunbrochFamilyTapestryI18n } from "./067-dunbroch-family-tapestry.i18n";

export const dunbrochFamilyTapestry: ItemCard = {
  id: "cRy",
  canonicalId: "ci_cRy",
  reprints: ["set12-067"],
  cardType: "item",
  name: "DunBroch Family Tapestry",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 67,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ae670e678624f89bb7b32b275ab04cb",
  },
  text: [
    {
      title: "TORN APART",
      description: "This item enters play exerted.",
    },
    {
      title: "MEND THE BOND",
      description:
        "{E}, Banish this item — Each player shuffles all character cards from their discard into their deck.",
    },
  ],
  abilities: [
    {
      id: "cRy-1",
      name: "TORN APART",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "TORN APART This item enters play exerted.",
    },
    {
      id: "cRy-2",
      name: "MEND THE BOND",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "shuffle-into-deck",
        intoDeck: "owner",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
      text: "MEND THE BOND {E}, Banish this item — Each player shuffles all character cards from their discard into their deck.",
    },
  ],
  i18n: dunbrochFamilyTapestryI18n,
};
