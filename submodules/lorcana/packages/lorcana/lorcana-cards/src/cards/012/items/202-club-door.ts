import type { ItemCard } from "@tcg/lorcana-types";
import { clubDoorI18n } from "./202-club-door.i18n";

export const clubDoor: ItemCard = {
  id: "sj6",
  canonicalId: "ci_sj6",
  reprints: ["set12-202"],
  cardType: "item",
  name: "Club Door",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_b0a88627594c4886893325e28443db63",
  },
  text: [
    {
      title: "WELCOME BACK, SIR",
      description:
        "If you have a character named Fat Cat in play, you may play this card for free.",
    },
    {
      title: "COOL CATS ONLY",
      description: "Your locations can't be challenged by characters with cost 2 or less.",
    },
  ],
  abilities: [
    {
      id: "sj6-1",
      name: "WELCOME BACK, SIR",
      type: "static",
      condition: {
        type: "has-named-character",
        name: "Fat Cat",
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: "full",
      },
      sourceZones: ["hand"],
      text: "WELCOME BACK, SIR If you have a character named Fat Cat in play, you may play this card for free.",
    },
    {
      id: "sj6-2",
      name: "COOL CATS ONLY",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "YOUR_LOCATIONS",
        challengerFilter: {
          type: "cost-comparison",
          operator: "lte",
          value: 2,
        },
      },
      text: "COOL CATS ONLY Your locations can't be challenged by characters with cost 2 or less.",
    },
  ],
  i18n: clubDoorI18n,
};
