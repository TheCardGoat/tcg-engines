import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arisannaLucentArbiter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7e22tk3ir1",
  slug: "arisanna-lucent-arbiter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7e22tk3ir1:face:default",
      catalogId: "7e22tk3ir1",
      name: "Arisanna, Lucent Arbiter",
      lineageName: "Arisanna",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Arisanna Lineage \n\n(3), REST: Reveal the top card of your deck. Negate target card activation if its reserve cost is equal to the reserve cost of the revealed card.",
      abilities: [
        {
          id: "7e22tk3ir1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Arisanna Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Arisanna",
          },
        },
        {
          id: "7e22tk3ir1-a2",
          kind: "activated",
          text: "(3), REST: Reveal the top card of your deck. Negate target card activation if its reserve cost is equal to the reserve cost of the revealed card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
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
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "stack-source",
                        binding: "target-activation",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                    operator: "eq",
                    right: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "revealed-card",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                },
                then: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-activation",
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

export default arisannaLucentArbiter;
