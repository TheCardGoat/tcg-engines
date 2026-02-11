import type { CharacterCard } from "@tcg/lorcana-types";

export const littleSisterResponsibleRabbit: CharacterCard = {
  abilities: [
    {
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
      id: "g97-1",
      name: "LET ME HELP",
      text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 163,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "3a961bf8eb9371454ce96de5f2d75d4141a71c9f",
  },
  franchise: "Robin Hood",
  fullName: "Little Sister - Responsible Rabbit",
  id: "g97",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Little Sister",
  set: "008",
  strength: 1,
  text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
  version: "Responsible Rabbit",
  willpower: 2,
};
