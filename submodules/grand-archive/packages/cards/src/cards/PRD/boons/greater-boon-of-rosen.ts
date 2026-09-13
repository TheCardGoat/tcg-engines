import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfRosen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dnqUeoEgJi",
  slug: "greater-boon-of-rosen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dnqUeoEgJi:face:default",
      catalogId: "dnqUeoEgJi",
      name: "Greater Boon of Rosen",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to bestow this boon, sacrifice two Powercell items.\n\nWhenever an Automaton ally you control dies, summon a Powercell token.",
      abilities: [
        {
          id: "dnqUeoEgJi-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to bestow this boon, sacrifice two Powercell items.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "bestow",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POWERCELL"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dnqUeoEgJi-a2",
          kind: "triggered",
          text: "Whenever an Automaton ally you control dies, summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
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
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default greaterBoonOfRosen;
