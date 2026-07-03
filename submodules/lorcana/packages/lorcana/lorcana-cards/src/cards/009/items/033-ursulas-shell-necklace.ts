import type { ItemCard } from "@tcg/lorcana-types";
import { ursulasShellNecklaceI18n } from "./033-ursulas-shell-necklace.i18n";

export const ursulasShellNecklace: ItemCard = {
  id: "U6u",
  canonicalId: "ci_Ewu",
  slug: "lorcana-ci_Ewu",
  printings: [
    {
      id: "set9-033",
      artId: "set9-033",
      setCode: "set9",
      collectorNumber: "33",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-034", "set9-033"],
  cardType: "item",
  name: "Ursula’s Shell Necklace",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 33,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_cfa8f36f7729492fa74fa256816c7f55",
    tcgPlayer: "649980",
  },
  text: [
    {
      title: "Now, Sing!",
      description: "Whenever you play a song, you may pay 1 {I} to draw a card.",
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
