import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fraternalGarrison: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ln926ymxdc",
  slug: "fraternal-garrison",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ln926ymxdc:face:default",
      catalogId: "ln926ymxdc",
      name: "Fraternal Garrison",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Jin Bonus] Whenever another ally enters the field under your control, Fraternal Garrison gets +1 POWER until end of turn. (Apply this effect only if your champion is Jin.)",
      abilities: [
        {
          id: "ln926ymxdc-a1",
          kind: "triggered",
          text: "[Jin Bonus] Whenever another ally enters the field under your control, Fraternal Garrison gets +1 POWER until end of turn. (Apply this effect only if your champion is Jin.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default fraternalGarrison;
