import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseCompassionateFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "g8h-1",
      name: "PATCH THEM UP",
      text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "3a83ae70ab7cd55e39f3141ec55b6b9f7ac441d2",
  },
  fullName: "Minnie Mouse - Compassionate Friend",
  id: "g8h",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Minnie Mouse",
  set: "005",
  strength: 1,
  text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
  version: "Compassionate Friend",
  willpower: 5,
};
