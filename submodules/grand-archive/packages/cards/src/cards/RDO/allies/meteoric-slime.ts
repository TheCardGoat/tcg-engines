import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meteoricSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5ybMub985n",
  slug: "meteoric-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5ybMub985n:face:default",
      catalogId: "5ybMub985n",
      name: "Meteoric Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Pride 3\n\n[Class Bonus] At the beginning of your end phase, glimpse 2. Then reveal the top two cards of your deck. When you do, as a Spell, deal X damage to target unit where X is the lowest reserve cost among the revealed cards.",
      abilities: [
        {
          id: "5ybMub985n-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "5ybMub985n-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, glimpse 2. Then reveal the top two cards of your deck. When you do, as a Spell, deal X damage to target unit where X is the lowest reserve cost among the revealed cards.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
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
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "reflexive",
                action: {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "referenced-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["main-deck"],
                      relationship: "zone-of",
                      player: "controller",
                      fromTop: true,
                    },
                  },
                },
                consequence: {
                  kind: "perform-as",
                  sourceKind: "spell",
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
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default meteoricSlime;
