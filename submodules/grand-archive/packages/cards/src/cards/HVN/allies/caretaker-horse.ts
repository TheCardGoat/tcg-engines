import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const caretakerHorse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r5uyjq37zh",
  slug: "caretaker-horse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r5uyjq37zh:face:default",
      catalogId: "r5uyjq37zh",
      name: "Caretaker Horse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "TAMER"],
        subtypes: ["GUARDIAN", "TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Another target ally you control becomes fostered. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "r5uyjq37zh-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Another target ally you control becomes fostered. (Apply this effect only if your champion's class matches this card's class.)",
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
              id: "target-1",
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
          ],
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
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "fostered",
            value: true,
          },
        },
      ],
    },
  },
};

export default caretakerHorse;
