import type { CharacterCard } from "@tcg/lorcana-types";

export const littleSisterResponsibleRabbit: CharacterCard = {
  id: "g97",
  cardType: "character",
  name: "Little Sister",
  version: "Responsible Rabbit",
  fullName: "Little Sister - Responsible Rabbit",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "008",
  text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 163,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a961bf8eb9371454ce96de5f2d75d4141a71c9f",
  },
  abilities: [
    {
      id: "g97-1",
      type: "triggered",
      name: "LET ME HELP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
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
      text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
