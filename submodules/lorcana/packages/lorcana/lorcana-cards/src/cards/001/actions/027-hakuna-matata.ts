import type { ActionCard } from "@tcg/lorcana-types";
import { hakunaMatataI18n } from "./027-hakuna-matata.i18n";

export const hakunaMatata: ActionCard = {
  id: "2U7",
  canonicalId: "ci_2U7",
  reprints: ["set1-027"],
  cardType: "action",
  name: "Hakuna Matata",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 27,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_2894c74113e7436abf095fe35dde6ea8",
    tcgPlayer: 506124,
  },
  text: "Remove up to 3 damage from each of your characters.",
  actionSubtype: "song",
  abilities: [
    {
      id: "10e-1",
      text: "Remove up to 3 damage from each of your characters.",
      name: "Hakuna Matata",
      effect: {
        amount: { type: "up-to", value: 3 },
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      type: "action",
    },
  ],
  i18n: hakunaMatataI18n,
};
