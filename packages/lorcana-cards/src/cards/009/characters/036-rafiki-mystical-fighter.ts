import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiMysticalFighter: CharacterCard = {
  abilities: [
    {
      id: "10q-1",
      keyword: "Challenger",
      text: "Challenger +3",
      type: "keyword",
      value: 3,
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  cost: 1,
  externalIds: {
    ravensburger: "8466dac039964fa9f794e1621d30ef9f87b4ead9",
  },
  franchise: "Lion King",
  fullName: "Rafiki - Mystical Fighter",
  id: "10q",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Rafiki",
  set: "009",
  strength: 0,
  text: "Challenger +3 (While challenging, this character gets +3 {S}.)\nANCIENT SKILLS Whenever he challenges a Hyena character, this character takes no damage from the challenge.",
  version: "Mystical Fighter",
  willpower: 2,
};
