import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protectHerAtAllCosts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OzNHncAfFJ",
  slug: "protect-her-at-all-costs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OzNHncAfFJ:face:default",
      catalogId: "OzNHncAfFJ",
      name: "Protect Her At All Costs",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Merlin Bonus] This card costs 2 less to activate.\n\nSummon a Memorite Obelith token with two sheen counters on it. You may change the target of an attack to that token.",
      abilities: [
        {
          id: "OzNHncAfFJ-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "OzNHncAfFJ-a2",
          kind: "card-resolution",
          text: "Summon a Memorite Obelith token with two sheen counters on it. You may change the target of an attack to that token.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Memorite Obelith",
                controller: "controller",
                entersWithCounters: [
                  {
                    counter: {
                      named: "sheen",
                    },
                    amount: 2,
                  },
                ],
                bindResultAs: "summoned-token",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "retarget",
                  subject: {
                    kind: "current-attack",
                  },
                  chooser: "controller",
                  newTarget: {
                    kind: "bound",
                    binding: "summoned-token",
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

export default protectHerAtAllCosts;
