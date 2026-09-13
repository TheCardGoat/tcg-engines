import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const starlitApothecary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ShQkyQMBCT",
  slug: "starlit-apothecary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ShQkyQMBCT:face:default",
      catalogId: "ShQkyQMBCT",
      name: "Starlit Apothecary",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "MARKET"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Arisanna Bonus] At the beginning of your recollection phase, summon a token copy of target Potion or Herb you control unless an opponent pays (4). If the summoned token is a Potion, it becomes brewed. (Each opponent decides to pay or not to pay the optional cost in turn order until one does.)",
      abilities: [
        {
          id: "ShQkyQMBCT-a1",
          kind: "triggered",
          text: "[Arisanna Bonus] At the beginning of your recollection phase, summon a token copy of target Potion or Herb you control unless an opponent pays (4). If the summoned token is a Potion, it becomes brewed. (Each opponent decides to pay or not to pay the optional cost in turn order until one does.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "copied-object",
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
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["POTION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HERB"],
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: "any-opponent-in-turn-order",
                cost: {
                  kind: "pay-reserve",
                  amount: 4,
                },
                otherwise: {
                  kind: "summon",
                  copyOf: {
                    kind: "bound",
                    binding: "copied-object",
                  },
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "tracked",
                    key: "summoned-token",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["POTION"],
                  },
                },
                then: {
                  kind: "set-activation-state",
                  subject: {
                    kind: "tracked",
                    key: "summoned-token",
                  },
                  state: "brewed",
                  value: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default starlitApothecary;
