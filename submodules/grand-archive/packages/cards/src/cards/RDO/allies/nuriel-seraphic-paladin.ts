import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nurielSeraphicPaladin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b9lli2PE7I",
  slug: "nuriel-seraphic-paladin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b9lli2PE7I:face:default",
      catalogId: "b9lli2PE7I",
      name: "Nuriel, Seraphic Paladin",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Advanced Imbue 3\n\nOn Enter:  If Nuriel is imbued, put a bulwark and a buff counter on it. \n\nWhenever your champion levels up, if Nuriel is imbued, put a bulwark counter on Nuriel.",
      abilities: [
        {
          id: "b9lli2PE7I-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "advanced",
          },
        },
        {
          id: "b9lli2PE7I-a2",
          kind: "triggered",
          text: "On Enter:  If Nuriel is imbued, put a bulwark and a buff counter on it.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "add-counter",
                  subject: {
                    kind: "event-subject",
                  },
                  counter: "bulwark",
                  amount: 1,
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "event-subject",
                  },
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
          },
        },
        {
          id: "b9lli2PE7I-a3",
          kind: "triggered",
          text: "Whenever your champion levels up, if Nuriel is imbued, put a bulwark counter on Nuriel.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "bulwark",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default nurielSeraphicPaladin;
