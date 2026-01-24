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
  abilities: [
    {
      id: "10q-1",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
      text: "Challenger +3",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
};
