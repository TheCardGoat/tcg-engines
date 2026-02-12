import type { CharacterCard } from "@tcg/lorcana-types";

export const fergusMcduckScroogesFather: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "xuv-1",
      name: "TOUGHEN UP",
      text: "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 144,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 3,
  externalIds: {
    ravensburger: "7a06ac544be3d4466e87e321002e6ed7ff044757",
  },
  franchise: "Ducktales",
  fullName: "Fergus McDuck - Scrooge's Father",
  id: "xuv",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Fergus McDuck",
  set: "010",
  strength: 3,
  text: "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
  version: "Scrooge's Father",
  willpower: 2,
};
