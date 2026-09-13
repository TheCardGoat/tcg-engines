import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightedJewel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hbpu4fo8oo",
  slug: "blighted-jewel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hbpu4fo8oo:face:default",
      catalogId: "hbpu4fo8oo",
      name: "Blighted Jewel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPECTER", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Blighted Jewel becomes ephemeral. Draw a card into your memory.\n\nEach ephemeral ally you control gets +1POWER as long as it entered the field this turn.",
      abilities: [
        {
          id: "hbpu4fo8oo-a1",
          kind: "triggered",
          text: "On Enter: Blighted Jewel becomes ephemeral. Draw a card into your memory.",
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
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                value: true,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
        {
          id: "hbpu4fo8oo-a2",
          kind: "static",
          staticKind: "effects",
          text: "Each ephemeral ally you control gets +1POWER as long as it entered the field this turn.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "object-state",
                        state: "ephemeral",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "history",
                event: "object-entered-field",
                window: "this-turn",
                subject: {
                  kind: "candidate",
                },
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
          ],
        },
      ],
    },
  },
};

export default blightedJewel;
