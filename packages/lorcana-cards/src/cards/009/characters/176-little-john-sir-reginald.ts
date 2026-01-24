import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnSirReginald: CharacterCard = {
  id: "1mt",
  cardType: "character",
  name: "Little John",
  version: "Sir Reginald",
  fullName: "Little John - Sir Reginald",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d409daa7c57554709734ba935a4ef64ae6db2b51",
  },
  abilities: [
    {
      id: "1mt-1",
      type: "triggered",
      name: "WHAT A BEAUTIFUL BRAWL!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:",
    },
    {
      id: "1mt-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 2,
        duration: "this-turn",
      },
      text: "- Chosen Hero character gains Resist +2 this turn.",
    },
    {
      id: "1mt-3",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "- Deal 2 damage to chosen Villain character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
