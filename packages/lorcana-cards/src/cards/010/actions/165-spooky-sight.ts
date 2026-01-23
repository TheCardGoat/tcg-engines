import type { ActionCard } from "@tcg/lorcana-types";

export const spookySight: ActionCard = {
  id: "1cd",
  cardType: "action",
  name: "Spooky Sight",
  inkType: ["sapphire"],
  set: "010",
  text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
  cost: 6,
  cardNumber: 165,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04d9c5d3320bafed8acb9a5cc82ba4571040032d",
  },
  abilities: [],
};
