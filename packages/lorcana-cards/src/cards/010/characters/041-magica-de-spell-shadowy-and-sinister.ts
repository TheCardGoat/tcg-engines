import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellShadowyAndSinister: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "1l8-1",
      name: "DARK INCANTATION",
      text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 41,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "ce4abde68eebdb7140d8d4d00acb5b45784eb045",
  },
  franchise: "Ducktales",
  fullName: "Magica De Spell - Shadowy and Sinister",
  id: "1l8",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Magica De Spell",
  set: "010",
  strength: 3,
  text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
  version: "Shadowy and Sinister",
  willpower: 4,
};
