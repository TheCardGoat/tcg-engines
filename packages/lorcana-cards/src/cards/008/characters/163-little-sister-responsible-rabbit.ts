import type { CharacterCard } from "@tcg/lorcana-types";

export const littleSisterResponsibleRabbit: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
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
        type: "optional",
      },
      id: "g97-1",
      name: "LET ME HELP",
      text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
