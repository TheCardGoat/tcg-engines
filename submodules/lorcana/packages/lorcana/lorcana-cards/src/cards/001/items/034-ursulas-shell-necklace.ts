import type { ItemCard } from "@tcg/lorcana-types";
import { ursulasShellNecklaceI18n } from "./034-ursulas-shell-necklace.i18n";

export const ursulasShellNecklace: ItemCard = {
  id: "0CY",
  canonicalId: "ci_Ewu",
  reprints: ["set1-034", "set9-033"],
  cardType: "item",
  name: "Ursula’s Shell Necklace",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 34,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_cfa8f36f7729492fa74fa256816c7f55",
    tcgPlayer: 649980,
  },
  text: [
    {
      title: "NOW, SING!",
      description: "Whenever you play a song, you may pay 1 to draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "optional",
      },
      id: "xg1-1",
      name: "NOW, SING!",
      text: "NOW, SING! Whenever you play a song, you may pay 1 to draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ursulasShellNecklaceI18n,
};
