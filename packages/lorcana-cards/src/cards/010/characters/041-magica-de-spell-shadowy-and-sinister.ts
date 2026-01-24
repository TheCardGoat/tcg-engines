import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellShadowyAndSinister: CharacterCard = {
  id: "1l8",
  cardType: "character",
  name: "Magica De Spell",
  version: "Shadowy and Sinister",
  fullName: "Magica De Spell - Shadowy and Sinister",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ce4abde68eebdb7140d8d4d00acb5b45784eb045",
  },
  abilities: [
    {
      id: "1l8-1",
      type: "triggered",
      name: "DARK INCANTATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          intoDeck: "owner",
        },
        chooser: "CONTROLLER",
      },
      text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
