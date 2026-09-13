import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellReactor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pgmsK3mcSo",
  slug: "cell-reactor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pgmsK3mcSo:face:default",
      catalogId: "pgmsK3mcSo",
      name: "Cell Reactor",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "DEVICE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST, Sacrifice a Powercell: Put a buff counter on target Automaton ally. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "pgmsK3mcSo-a1",
          kind: "activated",
          text: "REST, Sacrifice a Powercell: Put a buff counter on target Automaton ally. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
            ],
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cellReactor;
