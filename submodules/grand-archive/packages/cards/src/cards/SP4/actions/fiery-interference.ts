import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fieryInterference: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gt2zqtgs42",
  slug: "fiery-interference",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gt2zqtgs42:face:default",
      catalogId: "gt2zqtgs42",
      name: "Fiery Interference",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit. If that unit is a champion, its controller can't recover until end of turn.",
      abilities: [
        {
          id: "gt2zqtgs42-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If that unit is a champion, its controller can't recover until end of turn.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                then: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "recover",
                  subject: {
                    kind: "player",
                    player: {
                      controllerOf: "target-1",
                    },
                  },
                  duration: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default fieryInterference;
