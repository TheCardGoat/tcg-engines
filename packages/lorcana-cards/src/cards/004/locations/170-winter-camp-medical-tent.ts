import type { LocationCard } from "@tcg/lorcana-types";

export const winterCampMedicalTent: LocationCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "129-1",
      name: "HELP THE WOUNDED",
      text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 170,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "8a5ad6651326a91ac526f3f47fc3888894212935",
  },
  franchise: "Mulan",
  fullName: "Winter Camp - Medical Tent",
  id: "129",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Winter Camp",
  set: "004",
  text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
  version: "Medical Tent",
};
