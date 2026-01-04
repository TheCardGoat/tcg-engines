import type { CharacterCard } from "@tcg/lorcana-types";

export const herculestrueHero: CharacterCard = {
  id: "uyj",
  cardType: "character",
  name: "Hercules",
  version: "True Hero",
  fullName: "Hercules - True Hero",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "static",
      text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
      id: "uyj-1",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Prince"],
};
