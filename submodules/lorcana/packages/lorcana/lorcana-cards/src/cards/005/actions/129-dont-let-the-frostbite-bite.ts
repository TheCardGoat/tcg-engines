import type { ActionCard } from "@tcg/lorcana-types";
import { dontLetTheFrostbiteBiteI18n } from "./129-dont-let-the-frostbite-bite.i18n";

export const dontLetTheFrostbiteBite: ActionCard = {
  id: "2Hu",
  canonicalId: "ci_2Hu",
  reprints: ["set5-129"],
  cardType: "action",
  name: "Don't Let the Frostbite Bite",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 129,
  rarity: "rare",
  cost: 7,
  inkable: true,
  externalIds: {
    lorcast: "crd_0f1a48118a4d4952864c66eec69808cf",
    tcgPlayer: 560524,
  },
  text: "Ready all your characters. They can't quest for the rest of this turn.",
  actionSubtype: "song",
  abilities: [
    {
      id: "cu3-1",
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: "all",
              owner: "you",
              selector: "all",
              zones: ["play"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              cardTypes: ["character"],
              count: "all",
              owner: "you",
              selector: "all",
              zones: ["play"],
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: dontLetTheFrostbiteBiteI18n,
};
