import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const squallbindPounce: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ep3ajxiyd3",
  slug: "squallbind-pounce",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ep3ajxiyd3:face:default",
      catalogId: "ep3ajxiyd3",
      name: "Squallbind Pounce",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nUp to one target Ranger unit becomes distant.\n\nIf Squallbind Pounce is imbued, suppress up to one target attacking ally.",
      abilities: [
        {
          id: "ep3ajxiyd3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "ep3ajxiyd3-a2",
          kind: "card-resolution",
          text: "Up to one target Ranger unit becomes distant.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "class",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "ep3ajxiyd3-a3",
          kind: "card-resolution",
          text: "If Squallbind Pounce is imbued, suppress up to one target attacking ally.",
          targets: [
            {
              id: "ep3ajxiyd3-a3:target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "keyword-action",
              action: "suppress",
              subject: {
                kind: "bound",
                binding: "ep3ajxiyd3-a3:target-1",
              },
            },
          },
        },
      ],
    },
  },
};

export default squallbindPounce;
