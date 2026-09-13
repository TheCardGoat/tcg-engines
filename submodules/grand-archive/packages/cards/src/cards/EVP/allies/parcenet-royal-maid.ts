import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const parcenetRoyalMaid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xxoo7dl5j4",
  slug: "parcenet-royal-maid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xxoo7dl5j4:face:default",
      catalogId: "xxoo7dl5j4",
      name: "Parcenet, Royal Maid",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Level 2+] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nREST: Glimpse 1. Reveal the top card of your deck. When you reveal a wind element card this way, another target ally you control gains stealth until end of turn.",
      abilities: [
        {
          id: "xxoo7dl5j4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
        {
          id: "xxoo7dl5j4-a2",
          kind: "activated",
          text: "REST: Glimpse 1. Reveal the top card of your deck. When you reveal a wind element card this way, another target ally you control gains stealth until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-ally",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 1,
              },
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
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "revealed-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-ally",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "stealth",
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

export default parcenetRoyalMaid;
