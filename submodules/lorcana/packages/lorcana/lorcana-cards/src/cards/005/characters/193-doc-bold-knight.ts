import type { CharacterCard } from "@tcg/lorcana-types";
import { docBoldKnightI18n } from "./193-doc-bold-knight.i18n";

export const docBoldKnight: CharacterCard = {
  id: "qUy",
  canonicalId: "ci_qUy",
  reprints: ["set5-193"],
  cardType: "character",
  name: "Doc",
  version: "Bold Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 193,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_663b3bcaa1df4b48ad139248ef5a5208",
    tcgPlayer: 559668,
  },
  text: [
    {
      title: "DRASTIC MEASURES",
      description: "When you play this character, you may discard your hand to draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: "all",
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
        },
        type: "optional",
      },
      id: "1if-1",
      name: "DRASTIC MEASURES",
      text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: docBoldKnightI18n,
};
