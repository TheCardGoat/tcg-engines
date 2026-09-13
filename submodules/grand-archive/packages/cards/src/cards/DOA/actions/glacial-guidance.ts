import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glacialGuidance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6IOxuftyVv",
  slug: "glacial-guidance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6IOxuftyVv:face:default",
      catalogId: "6IOxuftyVv",
      name: "Glacial Guidance",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Rest target ally. If that ally is attacking, end the combat phase.\n\n[Class Bonus] Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "6IOxuftyVv-a1",
          kind: "card-resolution",
          text: "Rest target ally. If that ally is attacking, end the combat phase.",
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
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  state: "attacking",
                },
                then: {
                  kind: "end-phase",
                  phase: "combat",
                },
              },
            ],
          },
        },
        {
          id: "6IOxuftyVv-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default glacialGuidance;
