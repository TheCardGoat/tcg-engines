import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st09ShinnAsuka008: PilotCard = {
  cardNumber: "ST09-008",
  name: "Shinn Asuka",
  type: "pilot",
  color: "purple",
  traits: ["zaft", "minerva squad", "coordinator"],
  id: "ST09-008",
  canonicalId: "ST09-008",
  externalIds: { bandai: "gundam:st09-008" },
  slug: "shinn-asuka/st09-008",
  displayName: "Shinn Asuka",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-008",
  printings: [
    {
      id: "ST09-008",
      artId: "ST09-008",
      setCode: "ST09",
      collectorNumber: "ST09-008",
      cardNumber: "ST09-008",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-008.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-008_p1",
      artId: "ST09-008_p1",
      setCode: "ST09",
      collectorNumber: "ST09-008_p1",
      cardNumber: "ST09-008",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-008_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-008_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  reprints: ["ST09-008", "ST09-008_p1"],
  selectedPrintingId: "ST09-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-008.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 3,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】If this is a (Minerva Squad) Unit, choose 1 of your Resources. Set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "linkedUnitHasTrait", trait: "minerva squad" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "resource",
              zone: "resourceArea",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】If this is a (Minerva Squad) Unit, choose 1 of your Resources. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
