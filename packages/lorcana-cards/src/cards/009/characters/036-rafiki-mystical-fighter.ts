import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiMysticalFighter: CharacterCard = {
  id: "10q",
  cardType: "character",
  name: "Rafiki",
  version: "Mystical Fighter",
  fullName: "Rafiki - Mystical Fighter",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "009",
  text: "Challenger +3 (While challenging, this character gets +3 {S}.)\nANCIENT SKILLS Whenever he challenges a Hyena character, this character takes no damage from the challenge.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8466dac039964fa9f794e1621d30ef9f87b4ead9",
  },
  abilities: [],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rafikiMysticalFighter as ogRafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const rafikiMysticalFighter: LorcanitoCharacterCard = {
//   ...ogRafikiMysticalFighter,
//   id: "b7e",
//   reprints: [ogRafikiMysticalFighter.id],
//   number: 36,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649983,
//   },
// };
//
