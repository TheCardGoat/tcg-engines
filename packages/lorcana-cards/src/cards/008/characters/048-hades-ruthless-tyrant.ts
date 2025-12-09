import type { CharacterCard } from "@tcg/lorcana";

export const hadesRuthlessTyrant: CharacterCard = {
  id: "keg",
  cardType: "character",
  name: "Hades",
  version: "Ruthless Tyrant",
  fullName: "Hades - Ruthless Tyrant",
  inkType: ["amethyst", "ruby"],
  franchise: "Hercules",
  set: "008",
  text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 48,
  inkable: false,
  externalIds: {
    ravensburger: "498704459556a4ba90662e632e5370a2645ae1b8",
  },
  abilities: [
    {
      id: "keg-1",
      text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
      name: "SHORT ON PATIENCE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};
