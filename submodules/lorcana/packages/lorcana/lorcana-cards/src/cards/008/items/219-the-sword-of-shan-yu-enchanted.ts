import type { ItemCard } from "@tcg/lorcana-types";
import { theSwordOfShanyuEnchantedI18n } from "./219-the-sword-of-shan-yu-enchanted.i18n";

export const theSwordOfShanyuEnchanted: ItemCard = {
  id: "qJJ",
  canonicalId: "ci_r32",
  slug: "lorcana-ci_r32",
  printings: [
    {
      id: "set8-219-enchanted",
      artId: "ci_r32-enchanted",
      setCode: "set8",
      collectorNumber: "219",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set8-152"],
  cardType: "item",
  name: "The Sword of Shan-Yu",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8b81f6ba845442d095833d7c1bee3a6c",
    tcgPlayer: "631989",
  },
  text: [
    {
      title: "WORTHY WEAPON",
      description:
        "{E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        exertCharacters: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
      id: "1wb-1",
      name: "WORTHY WEAPON",
      text: "WORTHY WEAPON {E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: theSwordOfShanyuEnchantedI18n,
};
