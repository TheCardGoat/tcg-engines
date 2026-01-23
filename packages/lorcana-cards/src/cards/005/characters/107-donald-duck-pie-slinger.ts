import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckPieSlinger: CharacterCard = {
  id: "14s",
  cardType: "character",
  name: "Donald Duck",
  version: "Pie Slinger",
  fullName: "Donald Duck - Pie Slinger",
  inkType: ["ruby"],
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)\nHUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses 2 lore.\nRAGING DUCK While an opponent has 10 or more lore, this character gets +6 {S}.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 107,
  inkable: true,
  externalIds: {
    ravensburger: "92fccc7cdd7f354c194d3872d469ff147c33e442",
  },
  abilities: [
    {
      id: "14s-1",
      text: "HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore.",
      name: "HUMBLE PIE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 0,
        target: "EACH_OPPONENT",
      },
      condition: {
        type: "used-shift",
      },
    },
    {
      id: "14s-2",
      text: "RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.",
      name: "RAGING DUCK",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 0,
        target: "SELF",
      },
      condition: {
        type: "comparison",
        left: {
          type: "lore",
          controller: "opponent",
        },
        comparison: "greater-or-equal",
        right: {
          type: "constant",
          value: 0,
        },
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Knight"],
};
