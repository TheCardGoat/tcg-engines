import type { LocationCard } from "@tcg/lorcana-types";

export const winterCampMedicalTent: LocationCard = {
  id: "129",
  cardType: "location",
  name: "Winter Camp",
  version: "Medical Tent",
  fullName: "Winter Camp - Medical Tent",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a5ad6651326a91ac526f3f47fc3888894212935",
  },
  abilities: [
    {
      id: "129-1",
      type: "triggered",
      name: "HELP THE WOUNDED",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
    },
  ],
};
