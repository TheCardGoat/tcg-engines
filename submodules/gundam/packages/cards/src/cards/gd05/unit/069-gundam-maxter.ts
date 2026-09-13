import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamMaxter069: UnitCard = {
  cardNumber: "GD05-069",
  name: "Gundam Maxter",
  type: "unit",
  color: "white",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-069",
  canonicalId: "GD05-069",
  externalIds: { bandai: "gundam:gd05-069" },
  slug: "gundam-maxter-gd05-069",
  displayName: "Gundam Maxter",
  rulesText:
    "During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 4 cards of your deck. You may reveal 1 (Special Move) Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.\n【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-069",
  printings: [
    {
      id: "GD05-069",
      artId: "GD05-069",
      setCode: "GD05",
      collectorNumber: "GD05-069",
      cardNumber: "GD05-069",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-069.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-069",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-069.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "[Chibodee Crocket]",
  battlefieldZones: ["space", "earth"],
  effect:
    "During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 4 cards of your deck. You may reveal 1 (Special Move) Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.\n【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 4,
            return: "chooseTop",
            randomizeRemainingToBottom: true,
            tutorFilter: {
              owner: "friendly",
              count: 1,
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "special move",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 4 cards of your deck. You may reveal 1 (Special Move) Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "activatePairedCardTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
