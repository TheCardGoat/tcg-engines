import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09FreedomGundam004: UnitCard = {
  cardNumber: "ST09-004",
  name: "Freedom Gundam",
  type: "unit",
  color: "white",
  traits: ["orb"],
  id: "ST09-004",
  externalId: "gundam:st09-004",
  slug: "freedom-gundam-st09-004",
  displayName: "Freedom Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-004",
  printings: [
    {
      id: "ST09-004",
      collectorNumber: "ST09-004",
      cardNumber: "ST09-004",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-004.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-004_p1",
      collectorNumber: "ST09-004_p1",
      cardNumber: "ST09-004",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-004_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-004.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Kira Yamato]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nWhile a friendly Base in play, this Unit gains <Suppression>.\n\r\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "friendlyBaseInPlay" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While a friendly Base in play, this Unit gains <Suppression>. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "legendRare",
};
