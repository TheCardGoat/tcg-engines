import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const liminalGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0xayo7mk1w",
  slug: "liminal-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0xayo7mk1w:face:default",
      catalogId: "0xayo7mk1w",
      name: "Liminal Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Whenever your champion levels up, return this card from your graveyard to the field. If you do, it becomes ephemeral and draw a card. (If an ephemeral object would leave the field, banish it instead.)",
      abilities: [
        {
          id: "0xayo7mk1w-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, return this card from your graveyard to the field. If you do, it becomes ephemeral and draw a card. (If an ephemeral object would leave the field, banish it instead.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "field",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
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
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default liminalGuide;
