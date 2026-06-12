import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02MoebiusPeacemakerTeam011: UnitCard = {
  cardNumber: "GD02-011",
  name: "Moebius (Peacemaker Team)",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD02-011",
  externalId: "gundam:gd02-011",
  slug: "moebius-peacemaker-team-gd02-011",
  displayName: "Moebius (Peacemaker Team)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-011",
  printings: [
    {
      id: "GD02-011",
      collectorNumber: "GD02-011",
      cardNumber: "GD02-011",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-011.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-011.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 0,
  hp: 1,
  effect:
    "【Activate･Action】Destroy this Unit：Choose 1 enemy Base/enemy Shield this Unit is battling. Deal 6 damage to it.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
      },
      cost: {
        // Printed "Destroy this Unit：" — paid up-front in `payCost`
        // (play-card-shared.ts) by moving this card to its owner's trash
        // after all other cost components resolve.
        destroySelf: true,
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 6,
            target: {
              owner: "opponent",
              // "enemy Base / enemy Shield" — not expressible as a single
              // `cardType` because shields are zone-defined (any card placed
              // face-down into shieldArea), not a CardType value. Use a zone-OR
              // attribute predicate combined with `isBattling: true` so the
              // candidate set is exactly {defender's baseSection card,
              // defender's shieldArea cards} ∩ currentBattleParticipantIds.
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "zone", comparison: "eq", value: "baseSection" },
                    { attribute: "zone", comparison: "eq", value: "shieldArea" },
                  ],
                },
              ],
              isBattling: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Action】Destroy this Unit：Choose 1 enemy Base/enemy Shield this Unit is battling. Deal 6 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
