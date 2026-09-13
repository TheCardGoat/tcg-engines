import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chrysalisHazyCaterpillar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wsqvfsyid4",
  slug: "chrysalis-hazy-caterpillar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wsqvfsyid4:face:default",
      catalogId: "wsqvfsyid4",
      name: "Chrysalis, Hazy Caterpillar",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Fast Activation\n\n[Ciel Bonus] On Enter: As a Spell, if you have two or more wind element omens, suppress another target ally, item, or weapon.",
      abilities: [
        {
          id: "wsqvfsyid4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "wsqvfsyid4-a2",
          kind: "triggered",
          text: "[Ciel Bonus] On Enter: As a Spell, if you have two or more wind element omens, suppress another target ally, item, or weapon.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-object",
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
                      oneOf: ["ALLY", "ITEM", "WEAPON"],
                    },
                    {
                      kind: "not-source",
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
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "player-zone-count",
                players: "controller",
                quantifier: "all",
                zone: "banishment",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  ],
                },
                operator: "gte",
                value: 2,
              },
              then: {
                kind: "keyword-action",
                action: "suppress",
                subject: {
                  kind: "bound",
                  binding: "target-object",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default chrysalisHazyCaterpillar;
