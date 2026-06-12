import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03ImmortalColasour120: CommandCard = {
  cardNumber: "GD03-120",
  name: "Immortal Colasour",
  type: "command",
  color: "white",
  traits: ["superpower bloc", "un"],
  id: "GD03-120",
  externalId: "gundam:gd03-120",
  slug: "immortal-colasour-gd03-120",
  displayName: "Immortal Colasour",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-120",
  printings: [
    {
      id: "GD03-120",
      collectorNumber: "GD03-120",
      cardNumber: "GD03-120",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-120.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-120.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-120",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-120.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-120.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Patrick Colasour",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn.\n【Pilot】[Patrick Colasour]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "attackerDestroyedDefender",
            eventCardFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "superpower bloc" },
                    { attribute: "trait", comparison: "includes", value: "un" },
                  ],
                },
              ],
            },
            effect: {
              type: "triggered",
              activation: { timing: ["onDestroyByBattle"] },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      state: "rested",
                      count: 1,
                      attributeFilters: [
                        {
                          attribute: "or",
                          filters: [
                            {
                              attribute: "trait",
                              comparison: "includes",
                              value: "superpower bloc",
                            },
                            { attribute: "trait", comparison: "includes", value: "un" },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  action: {
                    action: "cantAttack",
                    duration: "thisTurn",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [
                        {
                          attribute: "or",
                          filters: [
                            {
                              attribute: "trait",
                              comparison: "includes",
                              value: "superpower bloc",
                            },
                            { attribute: "trait", comparison: "includes", value: "un" },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              sourceText:
                "During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn.",
            },
          },
        },
      ],
      sourceText:
        "【Main】During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn. 【Pilot】[Patrick Colasour]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
