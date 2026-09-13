import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st09SwordImpulseGundam006: UnitCard = {
  cardNumber: "ST09-006",
  name: "Sword Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "ST09-006",
  canonicalId: "ST09-006",
  externalIds: { bandai: "gundam:st09-006" },
  slug: "sword-impulse-gundam/st09-006",
  displayName: "Sword Impulse Gundam",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-006",
  printings: [
    {
      id: "ST09-006",
      artId: "ST09-006",
      setCode: "ST09",
      collectorNumber: "ST09-006",
      cardNumber: "ST09-006",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st09/ST09-006.webp",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-006_p1",
      artId: "ST09-006_p1",
      setCode: "ST09",
      collectorNumber: "ST09-006_p1",
      cardNumber: "ST09-006",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st09/ST09-006_p1.webp",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  reprints: ["ST09-006", "ST09-006_p1"],
  selectedPrintingId: "ST09-006",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st09/ST09-006.webp",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 4,
  hp: 2,
  linkCondition: "(Coordinator) Trait / (Minerva Squad) Trait",
  effect:
    "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
