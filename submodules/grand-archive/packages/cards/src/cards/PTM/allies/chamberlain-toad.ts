import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chamberlainToad: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vgu1C2Lw6e",
  slug: "chamberlain-toad",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vgu1C2Lw6e:face:default",
      catalogId: "vgu1C2Lw6e",
      name: "Chamberlain Toad",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HUMAN", "FROG"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus] (2): Wake up Chamberlain Toad and it gains taunt until end of turn. Activate this ability only during an opponent's recollection phase.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "vgu1C2Lw6e-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "vgu1C2Lw6e-a2",
          kind: "activated",
          text: "[Class Bonus] (2): Wake up Chamberlain Toad and it gains taunt until end of turn. Activate this ability only during an opponent's recollection phase.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "phase",
                phase: "recollection",
              },
              {
                kind: "turn-player",
                player: "opponent",
              },
            ],
          },
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
                kind: "wake",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
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
                    name: "taunt",
                  },
                },
              },
            ],
          },
        },
        {
          id: "vgu1C2Lw6e-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
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
        },
      ],
    },
  },
};

export default chamberlainToad;
