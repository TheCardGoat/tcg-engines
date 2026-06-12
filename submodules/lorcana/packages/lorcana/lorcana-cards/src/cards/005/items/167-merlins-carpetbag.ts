import type { ItemCard } from "@tcg/lorcana-types";
import { merlinsCarpetbagI18n } from "./167-merlins-carpetbag.i18n";

export const merlinsCarpetbag: ItemCard = {
  id: "0a0",
  canonicalId: "ci_0a0",
  reprints: ["set5-167"],
  cardType: "item",
  name: "Merlin's Carpetbag",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 167,
  rarity: "uncommon",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_b17b7e285ce043a2bc97e5953a39c574",
    tcgPlayer: 560543,
  },
  text: [
    {
      title: "HOCKETY POCKETY",
      description: "{E}, 1 {I} — Return an item card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        cardType: "item",
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "1ya-1",
      name: "HOCKETY POCKETY",
      text: "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.",
      type: "activated",
    },
  ],
  i18n: merlinsCarpetbagI18n,
};
