import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st04StrikerPack012: CommandCard = {
  cardNumber: "ST04-012",
  name: "Striker Pack",
  type: "command",
  color: "white",
  traits: ["-"],
  id: "ST04-012",
  externalId: "gundam:st04-012",
  slug: "striker-pack-st04-012",
  displayName: "Striker Pack",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-012",
  printings: [
    {
      id: "ST04-012",
      collectorNumber: "ST04-012",
      cardNumber: "ST04-012",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-012.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-012_p1",
      collectorNumber: "ST04-012_p1",
      cardNumber: "ST04-012",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-012_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST04-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-012.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･&lt;Blocker&gt;) Unit token.<br>【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)･AP4･HP2･&lt;Blocker&gt;) or 1 [Launcher Strike Gundam]((Earth Alliance)･AP2･HP4･&lt;Blocker&gt;) Unit token.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "eq",
            count: 0,
            hasTrait: "earth alliance",
            isToken: true,
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Aile Strike Gundam",
                  traits: ["earth alliance"],
                  ap: 3,
                  hp: 3,
                  keywordEffects: [{ keyword: "Blocker" }],
                  deployState: "active",
                  printedCardNumber: "T-008",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Burst】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)·AP3·HP3·<Blocker>) Unit token.",
    },
    {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "eq",
            count: 0,
            hasTrait: "earth alliance",
            isToken: true,
          },
          thenDirectives: [
            {
              kind: "chooseOne",
              options: [
                {
                  label: "Sword Strike Gundam",
                  directives: [
                    {
                      action: {
                        action: "deployToken",
                        token: {
                          name: "Sword Strike Gundam",
                          traits: ["earth alliance"],
                          ap: 4,
                          hp: 2,
                          keywordEffects: [{ keyword: "Blocker" }],
                          deployState: "active",
                          printedCardNumber: "T-010",
                        },
                      },
                    },
                  ],
                },
                {
                  label: "Launcher Strike Gundam",
                  directives: [
                    {
                      action: {
                        action: "deployToken",
                        token: {
                          name: "Launcher Strike Gundam",
                          traits: ["earth alliance"],
                          ap: 2,
                          hp: 4,
                          keywordEffects: [{ keyword: "Blocker" }],
                          deployState: "active",
                          printedCardNumber: "T-009",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      sourceText:
        "【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)·AP4·HP2·<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)·AP2·HP4·<Blocker>) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
