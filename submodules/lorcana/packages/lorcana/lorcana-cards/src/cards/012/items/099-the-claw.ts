import type { ItemCard } from "@tcg/lorcana-types";
import { theClawI18n } from "./099-the-claw.i18n";

export const theClaw: ItemCard = {
  id: "7z5",
  canonicalId: "ci_7z5",
  reprints: ["set12-099"],
  cardType: "item",
  name: "The Claw",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 99,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_559113fd213144ec805c27797d7376ef",
  },
  text: [
    {
      title: "THE CLAW CHOOSES",
      description:
        "{E}, 2 {I}, Banish one of your characters — Return chosen opposing character to their player's hand.",
    },
  ],
  abilities: [
    {
      id: "7z5-1",
      name: "THE CLAW CHOOSES",
      type: "activated",
      text: "THE CLAW CHOOSES {E}, 2 {I}, Banish one of your characters — Return chosen opposing character to their player's hand.",
      cost: { exert: true, ink: 2, banishCharacter: true },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: theClawI18n,
};
