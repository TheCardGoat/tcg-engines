import type { UnitCard } from "@tcg/gundam-types";

export const tCharsZakuIi006: UnitCard = {
  cardNumber: "T-006",
  name: "Char's Zaku Ⅱ",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  canonicalId: "T-006",
  slug: "char-s-zaku-ii/t-006",
  printings: [
    {
      id: "T-006",
      artId: "T-006",
      // Physical product ownership is ST03; `T-006` is the token card-number
      // namespace, not a standalone product. Official EN-US product evidence:
      // https://www.gundam-gcg.com/en/products/st03.html
      setCode: "ST03",
      collectorNumber: "T-006",
      cardNumber: "T-006",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "",
    },
  ],
  level: 0,
  cost: 0,
  ap: 3,
  hp: 1,
  effect: "-",
  effects: [],
  keywordEffects: [],
  rarity: "common",
};
