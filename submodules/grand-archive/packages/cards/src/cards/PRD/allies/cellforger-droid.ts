import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellforgerDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wgX472k6J7",
  slug: "cellforger-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wgX472k6J7:face:default",
      catalogId: "wgX472k6J7",
      name: "Cellforger Droid",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISCORP", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "On Enter: Summon a Powercell token rested.\n\n(4), REST: Summon a Powercell token rested.",
      abilities: [
        {
          id: "wgX472k6J7-a1",
          kind: "triggered",
          text: "On Enter: Summon a Powercell token rested.",
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
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
        {
          id: "wgX472k6J7-a2",
          kind: "activated",
          text: "(4), REST: Summon a Powercell token rested.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default cellforgerDroid;
