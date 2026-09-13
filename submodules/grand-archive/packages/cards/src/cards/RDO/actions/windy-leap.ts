import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windyLeap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0xk8GPkiOz",
  slug: "windy-leap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0xk8GPkiOz:face:default",
      catalogId: "0xk8GPkiOz",
      name: "Windy Leap",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish target ally you control, then return it to the field under its owner’s control rested. If it's a Ranger ally, it becomes distant. (Units stay distant until the end of their controller's turn.)\n",
      abilities: [
        {
          id: "0xk8GPkiOz-a1",
          kind: "card-resolution",
          text: "Banish target ally you control, then return it to the field under its owner’s control rested. If it's a Ranger ally, it becomes distant. (Units stay distant until the end of their controller's turn.)",
          targets: [
            {
              id: "target-ally",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                state: "rested",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-ally",
                  },
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["RANGER"],
                      },
                    ],
                  },
                },
                then: {
                  kind: "set-object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-ally",
                  },
                  state: "distant",
                  value: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default windyLeap;
