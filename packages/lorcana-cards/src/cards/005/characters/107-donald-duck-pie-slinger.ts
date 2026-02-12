import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckPieSlinger: CharacterCard = {
  abilities: [
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        amount: 0,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "14s-1",
      name: "HUMBLE PIE",
      text: "HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      condition: {
        comparison: "greater-or-equal",
        left: {
          controller: "opponent",
          type: "lore",
        },
        right: {
          type: "constant",
          value: 0,
        },
        type: "comparison",
      },
      effect: {
        modifier: 0,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "14s-2",
      name: "RAGING DUCK",
      text: "RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.",
      type: "static",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Knight"],
  cost: 5,
  externalIds: {
    ravensburger: "92fccc7cdd7f354c194d3872d469ff147c33e442",
  },
  fullName: "Donald Duck - Pie Slinger",
  id: "14s",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Donald Duck",
  set: "005",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)\nHUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses 2 lore.\nRAGING DUCK While an opponent has 10 or more lore, this character gets +6 {S}.",
  version: "Pie Slinger",
  willpower: 6,
};
