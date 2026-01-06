import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const break: ActionCard = {
  id: "whn",
  cardType: "action",
  name: "Break",
  version: "",
  fullName: "Break",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "Banish chosen item.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  rarity: "common",
  externalIds: 
    ravensburger: "",
    tcgPlayer: 506000,,
  abilities: [
      type: "action",
      effect: 
          type: "banish",
          target: "CHOSEN_CHARACTER",,
      id: "whn-1",
      text: "",,
  ],
};
