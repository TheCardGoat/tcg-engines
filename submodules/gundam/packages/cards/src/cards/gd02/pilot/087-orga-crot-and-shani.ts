import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02OrgaCrotAndShani087: PilotCard = {
  cardNumber: "GD02-087",
  name: "Orga, Crot, and Shani",
  type: "pilot",
  color: "blue",
  traits: ["earth alliance", "biological cpu"],
  id: "GD02-087",
  externalId: "gundam:gd02-087",
  slug: "orga-crot-and-shani-gd02-087",
  displayName: "Orga, Crot, and Shani",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-087",
  printings: [
    {
      id: "GD02-087",
      collectorNumber: "GD02-087",
      cardNumber: "GD02-087",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-087.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-087.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-087",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-087.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-087.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Linked】If this is a blue Unit, choose 1 enemy Unit with &lt;Blocker&gt;. Rest it.<br>",
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
        timing: ["whenLinked"],
        // "If this is a blue Unit" — gates the whole trigger on the
        // linked unit being blue. `linkedUnitHasColor` resolves via
        // the pilot-rebound `selfIdentityCardId` (rule 3-3-9-1) and
        // is false when unpaired or when the linked unit is not blue.
        conditions: [{ type: "linkedUnitHasColor", color: "blue" }],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText:
        "【When Linked】If this is a blue Unit, choose 1 enemy Unit with <Blocker>. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
