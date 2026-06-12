import type { ItemCard } from "@tcg/lorcana-types";
import { swordInTheStoneI18n } from "./136-sword-in-the-stone.i18n";

export const swordInTheStone: ItemCard = {
  id: "zL0",
  canonicalId: "ci_zL0",
  reprints: ["set2-136"],
  cardType: "item",
  name: "Sword in the Stone",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 136,
  rarity: "uncommon",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_24945449688b42f699bff7a47b3f282b",
    tcgPlayer: 525105,
  },
  text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        duration: "this-turn",
        modifier: {
          type: "damage-on-target",
        },
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "pw4-1",
      name: "SWORD IN THE STONE",
      text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
      type: "activated",
    },
  ],
  i18n: swordInTheStoneI18n,
};
