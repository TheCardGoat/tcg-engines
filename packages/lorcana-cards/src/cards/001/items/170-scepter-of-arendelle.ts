import type { ItemCard } from "@tcg/lorcana";

export const scepterOfArendelle: ItemCard = {
  id: "1j9",
  cardType: "item",
  name: "Scepter of Arendelle",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "001",
  text: "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 170,
  inkable: true,
  externalIds: {
    ravensburger: "c727888823a011c91f8ab8c27400f74ffd775c06",
  },
  abilities: [
    {
      id: "1j9-1",
      text: "COMMAND {E} — Chosen character gains Support this turn.",
      name: "COMMAND",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        duration: "turn",
      },
    },
  ],
};
