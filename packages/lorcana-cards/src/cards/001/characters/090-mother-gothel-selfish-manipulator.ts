import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const motherGothel: CharacterCard = {
  id: "opl",
  cardType: "character",
  name: "Mother Gothel",
  version: "Selfish Manipulator",
  fullName: "Mother Gothel - Selfish Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  text: "**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 90,
  inkable: true,
  rarity: "super_rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508772,
  },
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      id: "opl-1",
      text: {
        name: "Skip the Drama, Stay with Mama",
        text: "While this character is exerted, opposing character can't quest.",
        conditions: [
          {
            type: "exerted",
          },
        ],
        target: {
          type: "opposingCharacters",
          text: "opposing characters",
        },
        ability: {
          type: "static",
          ability: "effects",
          target: {
            type: "thisCharacter",
            text: "this character",
          },
          effects: [
            {
              type: "restriction",
              restriction: "quest",
              duration: "static",
              target: {
                type: "opposingCharacters",
                text: "opposing characters",
              },
            },
          ],
        },
      },
    },
  ],
};
