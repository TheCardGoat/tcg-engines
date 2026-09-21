import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteLinlin049I18n } from "./op17-049-charlotte-linlin.i18n.ts";

export const op17CharlotteLinlin049: CharacterCard = {
  id: "OP17-049",
  canonicalId: "OP17-049",
  slug: "charlotte-linlin/op17-049",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "OP17-049",
      artId: "OP17-049",
      setCode: "OP17",
      collectorNumber: "049",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-049_r2FuHxT.jpg",
      label: "Charlotte Linlin (049)",
    },
    {
      id: "OP17-049_p1",
      artId: "OP17-049_p1",
      setCode: "OP17",
      collectorNumber: "049",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-049_p1_aPY9o8c.jpg",
      label: "Charlotte Linlin (049) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP17",
  cost: 5,
  power: 7000,
  traits: ["Rocks Pirates"],
  attribute: "special",
  effect:
    "[On Play] Your opponent chooses one:\n• Draw 2 cards.\n• Your opponent trashes 2 cards from their hand.\n[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Up to 1 of your Leader or Characters gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17CharlotteLinlin049I18n,
};
