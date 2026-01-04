import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesinfernalSchemer: CharacterCard = {
  id: "x36",
  cardType: "character",
  name: "Hades",
  version: "Infernal Schemer",
  fullName: "Hades - Infernal Schemer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 147,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
      id: "x36-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};
