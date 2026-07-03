import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHungryBearEpicI18n } from "./217-winnie-the-pooh-hungry-bear-epic.i18n";

export const winnieThePoohHungryBearEpic: CharacterCard = {
  id: "Sil",
  canonicalId: "ci_mZ8",
  slug: "lorcana-ci_mZ8",
  printings: [
    {
      id: "set11-217-epic",
      artId: "ci_mZ8-epic",
      setCode: "set11",
      collectorNumber: "217",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-151"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hungry Bear",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5da5944a7e9240aab2d30466337643c3",
    tcgPlayer: "677152",
  },
  text: [
    {
      title: "LOOKING FOR",
      description:
        "A MORSEL When you play this character, you may return an item card from your discard to your hand.",
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
  i18n: winnieThePoohHungryBearEpicI18n,
};
