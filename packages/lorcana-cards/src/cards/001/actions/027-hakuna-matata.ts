import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const hakunaMatata: ActionCard = {
  id: "ege",
  cardType: "action",
  name: "Hakuna Matata",
  version: "",
  fullName: "Hakuna Matata",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this
song for free.)_
Remove up to 3 damage from each of your characters.",
  cost: 4,
  cardNumber: 27,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 506124,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "remove-damage",
          amount: 3,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        },
      id: "ege-1",
      text: "Remove up to 3 damage from each of your characters.",
    },
  ],
};
