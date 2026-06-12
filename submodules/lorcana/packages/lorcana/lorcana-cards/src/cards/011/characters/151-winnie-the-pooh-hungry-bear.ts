import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHungryBearI18n } from "./151-winnie-the-pooh-hungry-bear.i18n";

export const winnieThePoohHungryBear: CharacterCard = {
  id: "h5D",
  canonicalId: "ci_mZ8",
  reprints: ["set11-151"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hungry Bear",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 151,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5da5944a7e9240aab2d30466337643c3",
    tcgPlayer: 677152,
  },
  text: [
    {
      title: "LOOKING FOR A MORSEL",
      description:
        "When you play this character, you may return an item card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "14x-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CONTROLLER",
          type: "return-from-discard",
          cardType: "item",
        },
        type: "optional",
      },
      name: "LOOKING FOR A MORSEL",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "LOOKING FOR A MORSEL When you play this character, you may return an item card from your discard to your hand.",
    },
  ],
  i18n: winnieThePoohHungryBearI18n,
};
