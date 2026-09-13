import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const searingRebuke: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hdvpug4d5m",
  slug: "searing-rebuke",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hdvpug4d5m:face:default",
      catalogId: "hdvpug4d5m",
      name: "Searing Rebuke",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 3 damage that would be dealt to your champion this turn.\n\n[Class Bonus] Whenever damage is prevented this way, deal 3 damage to target champion you don't control.",
      abilities: [
        {
          id: "hdvpug4d5m-a1",
          kind: "card-resolution",
          text: "Prevent the next 3 damage that would be dealt to your champion this turn.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 3,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "hdvpug4d5m-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever damage is prevented this way, deal 3 damage to target champion you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-prevented",
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
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default searingRebuke;
