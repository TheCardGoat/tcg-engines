import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseCompassionateFriend: CharacterCard = {
  id: "g8h",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Compassionate Friend",
  fullName: "Minnie Mouse - Compassionate Friend",
  inkType: ["amber"],
  set: "005",
  text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 24,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a83ae70ab7cd55e39f3141ec55b6b9f7ac441d2",
  },
  abilities: [
    {
      id: "g8h-1",
      type: "triggered",
      name: "PATCH THEM UP",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
