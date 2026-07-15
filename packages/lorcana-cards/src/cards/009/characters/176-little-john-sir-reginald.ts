import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnSirReginald: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1mt-1",
      name: "WHAT A BEAUTIFUL BRAWL!",
      text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      id: "1mt-2",
      text: "- Chosen Hero character gains Resist +2 this turn.",
      type: "action",
    },
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1mt-3",
      text: "- Deal 2 damage to chosen Villain character.",
      type: "action",
    },
  ],
  cardNumber: 176,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "d409daa7c57554709734ba935a4ef64ae6db2b51",
  },
  franchise: "Robin Hood",
  fullName: "Little John - Sir Reginald",
  id: "1mt",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Little John",
  set: "009",
  strength: 2,
  text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
  version: "Sir Reginald",
  willpower: 2,
};
