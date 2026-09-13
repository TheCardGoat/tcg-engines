import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02CartaSGrazeRitterGroundType073: UnitCard = {
  cardNumber: "GD02-073",
  name: "Carta's Graze Ritter (Ground Type)",
  type: "unit",
  battlefieldZones: ["earth"],
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-073",
  canonicalId: "GD02-073",
  externalIds: { bandai: "gundam:gd02-073" },
  slug: "carta-s-graze-ritter-ground-type/gd02-073",
  displayName: "Carta's Graze Ritter (Ground Type)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-073",
  printings: [
    {
      id: "GD02-073",
      artId: "GD02-073",
      setCode: "GD02",
      collectorNumber: "GD02-073",
      cardNumber: "GD02-073",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-073.webp",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-073_p1",
      artId: "GD02-073_p1",
      setCode: "GD02",
      collectorNumber: "GD02-073_p1",
      cardNumber: "GD02-073",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-073_p1.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-073", "GD02-073_p1"],
  selectedPrintingId: "GD02-073",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-073.webp",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 5,
  hp: 4,
  linkCondition: "[Carta Issue]",
  effect:
    "During your opponent's turn, the enemy Unit battling this Unit gains &lt;First Strike&gt;.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "opponent",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "permanent",
            target: {
              owner: "opponent",
              cardType: "unit",
              // "the enemy Unit battling THIS Unit" is relational: being in
              // any battle is insufficient; its opposing combatant must be
              // Carta itself.
              isBattling: {
                opponentMatches: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          },
        },
      ],
      sourceText:
        "During your opponent's turn, the enemy Unit battling this Unit gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
