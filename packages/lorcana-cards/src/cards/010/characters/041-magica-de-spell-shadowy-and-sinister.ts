import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellShadowyAndSinister: CharacterCard = {
  abilities: [
    {
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
      id: "1l8-1",
      name: "DARK INCANTATION",
      text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
