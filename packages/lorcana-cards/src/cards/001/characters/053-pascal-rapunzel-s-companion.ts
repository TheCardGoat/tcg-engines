import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const pascal: CharacterCard = {
  id: "c2y",
  cardType: "character",
  name: "Pascal",
  version: "Rapunzel's Companion",
  fullName: "Pascal - Rapunzel's Companion",
  inkType: [
    "amethyst",
  ],
  franchise: "Tangled",
  set: "001",
  text: "**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characterswith Evasive can challenge them.)_",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493488,
  },
  classifications: [
    "Storyborn",
    "Ally",
  ],
  abilities: [
    {
      type: "static",
      effect: {
          type: "restriction",
          restriction: "cant-sing",
          target: "SELF",
        },
      id: "c2y-1",
      text: {
          name: "Camouflage",
          text: "While you have another character in play, this character gains **Evasive**. _(Only characterswith Evasive can challenge them.)_",
          ability: {
            type: "keyword",
            text: "Evasive",
            keyword: "Evasive",
          },
          conditions: [
            {
              type: "not-alone",
            },
          ],
        },
    },
  ],
};
