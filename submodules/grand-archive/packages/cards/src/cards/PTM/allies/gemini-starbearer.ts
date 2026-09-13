import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const geminiStarbearer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NyPQW7hkAq",
  slug: "gemini-starbearer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NyPQW7hkAq:face:default",
      catalogId: "NyPQW7hkAq",
      name: "Gemini Starbearer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "On Enter: Summon an Astral Shard token.\n\nREST: As a Spell, deal X damage to target unit, where X is the amount of objects named Astral Shard you control.",
      abilities: [
        {
          id: "NyPQW7hkAq-a1",
          kind: "triggered",
          text: "On Enter: Summon an Astral Shard token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Astral Shard",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "NyPQW7hkAq-a2",
          kind: "activated",
          text: "REST: As a Spell, deal X damage to target unit, where X is the amount of objects named Astral Shard you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "name",
                        value: "Astral Shard",
                        match: "exact",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHARD"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
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
};

export default geminiStarbearer;
