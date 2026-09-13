import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const raiManaWeaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ILtLfjQEe",
  slug: "rai-mana-weaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6ILtLfjQEe:face:default",
      catalogId: "6ILtLfjQEe",
      name: "Rai, Mana Weaver",
      lineageName: "Rai",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        'Rai Lineage (Rai, Mana Weaver must be leveled from a previous level "Rai" champion.)\n\nREST, Remove four enlighten counters from Rai: Copy target Mage Spell card activation. You may choose new targets for the copy.',
      abilities: [
        {
          id: "6ILtLfjQEe-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Rai Lineage (Rai, Mana Weaver must be leveled from a previous level "Rai" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Rai",
          },
        },
        {
          id: "6ILtLfjQEe-a2",
          kind: "activated",
          text: "REST, Remove four enlighten counters from Rai: Copy target Mage Spell card activation. You may choose new targets for the copy.",
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
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: "enlighten",
                amount: 4,
              },
            ],
          },
          targets: [
            {
              id: "target-card-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                sourceFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["MAGE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
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
                kind: "copy",
                subject: {
                  kind: "bound",
                  binding: "target-card-activation",
                },
                copy: "card-activation",
                bindResultAs: "copied-activation",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "retarget",
                  subject: {
                    kind: "bound",
                    binding: "copied-activation",
                  },
                  chooser: "controller",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default raiManaWeaver;
