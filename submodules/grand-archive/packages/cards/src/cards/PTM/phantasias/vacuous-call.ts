import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vacuousCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ex6AXz6IhB",
  slug: "vacuous-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ex6AXz6IhB:face:default",
      catalogId: "ex6AXz6IhB",
      name: "Vacuous Call",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Summon a Vacuous Servant token.\n\n[Ciel Bonus] (2), Discard an ally card, sacrifice Vacuous Call: Summon a Vacuous Servant token.",
      abilities: [
        {
          id: "ex6AXz6IhB-a1",
          kind: "triggered",
          text: "On Enter: Summon a Vacuous Servant token.",
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
            object: "Vacuous Servant",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "ex6AXz6IhB-a2",
          kind: "activated",
          text: "[Ciel Bonus] (2), Discard an ally card, sacrifice Vacuous Call: Summon a Vacuous Servant token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Vacuous Servant",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default vacuousCall;
