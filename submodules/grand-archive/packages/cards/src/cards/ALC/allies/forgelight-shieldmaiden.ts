import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgelightShieldmaiden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kuz07nk45s",
  slug: "forgelight-shieldmaiden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kuz07nk45s:face:default",
      catalogId: "kuz07nk45s",
      name: "Forgelight Shieldmaiden",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\nOn Foster: Draw two cards, then discard a card. Class Bonus: If a fire element card was discarded, put a buff counter on Forgelight Shieldmaiden.",
      abilities: [
        {
          id: "kuz07nk45s-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "kuz07nk45s-a2",
          kind: "triggered",
          text: "On Foster: Draw two cards, then discard a card. Class Bonus: If a fire element card was discarded, put a buff counter on Forgelight Shieldmaiden.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "champion-matches-source",
                      characteristic: "class",
                    },
                    {
                      kind: "subject-matches",
                      subject: {
                        kind: "bound",
                        binding: "discarded-card",
                      },
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  ],
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default forgelightShieldmaiden;
