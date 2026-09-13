import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const decayingReproach: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qXIKFip2t4",
  slug: "decaying-reproach",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qXIKFip2t4:face:default",
      catalogId: "qXIKFip2t4",
      name: "Decaying Reproach",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, remove up to four wither counters from objects you don't control.\n\nDeal 3+X damage to target unit, where X is twice the amount of wither counters removed.\n\n[Diao Chan Bonus] (2), Discard this card from your hand: Draw a card into your memory and recover 2.",
      abilities: [
        {
          id: "qXIKFip2t4-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, remove up to four wither counters from objects you don't control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-remove-counters",
                player: "each-player",
                counter: "wither",
                count: {
                  kind: "up-to",
                  amount: 4,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qXIKFip2t4-a2",
          kind: "card-resolution",
          text: "Deal 3+X damage to target unit, where X is twice the amount of wither counters removed.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                3,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
        {
          id: "qXIKFip2t4-a3",
          kind: "activated",
          text: "[Diao Chan Bonus] (2), Discard this card from your hand: Draw a card into your memory and recover 2.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "discard-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default decayingReproach;
