import type { UnitCard } from "@tcg/gundam-types";

export const tZakuIi007: UnitCard = {
  cardNumber: "T-007",
  name: "Zaku Ⅱ",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  canonicalId: "T-007",
  slug: "zaku-ii/t-007",
  printings: [
    {
      id: "T-007",
      artId: "T-007",
      // Physical product ownership is ST03; `T-007` is the token card-number
      // namespace, not a standalone product. Official EN-US product evidence:
      // https://www.gundam-gcg.com/en/products/st03.html
      setCode: "ST03",
      collectorNumber: "T-007",
      cardNumber: "T-007",
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
  ap: 1,
  hp: 1,
  effect: "-",
  effects: [],
  keywordEffects: [],
  rarity: "common",
};
