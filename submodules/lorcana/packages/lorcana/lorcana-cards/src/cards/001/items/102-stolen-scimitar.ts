import type { ItemCard } from "@tcg/lorcana-types";
import { stolenScimitarI18n } from "./102-stolen-scimitar.i18n";

export const stolenScimitar: ItemCard = {
  id: "EDv",
  canonicalId: "ci_EDv",
  reprints: ["set1-102"],
  cardType: "item",
  name: "Stolen Scimitar",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 102,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a86ebded73ba41e2ab58fcebfd30eeb0",
    tcgPlayer: 507262,
  },
  text: [
    {
      title: "SLASH",
      description:
        "{E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        selfReplacement: {
          condition: {
            type: "selected-target-name",
            name: "Aladdin",
          },
          value: 2,
        },
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "17q-1",
      name: "SLASH",
      text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      type: "activated",
    },
  ],
  i18n: stolenScimitarI18n,
};
