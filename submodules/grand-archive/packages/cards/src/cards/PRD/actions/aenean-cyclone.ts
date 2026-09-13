import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanCyclone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eCxOH7BgsS",
  slug: "aenean-cyclone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eCxOH7BgsS:face:default",
      catalogId: "eCxOH7BgsS",
      name: "Aenean Cyclone",
      cost: {
        kind: "reserve",
        amount: 13,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion’s level.)\n\nSuppress any amount of target non-champion objects. Banish Aenean Cyclone.",
      abilities: [
        {
          id: "eCxOH7BgsS-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion’s level.)",
          keyword: {
            name: "efficiency",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "eCxOH7BgsS-a2",
          kind: "card-resolution",
          text: "Suppress any amount of target non-champion objects. Banish Aenean Cyclone.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "suppress",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default aeneanCyclone;
