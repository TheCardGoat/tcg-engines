import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const twingaleParry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "V8XBfRpDRJ",
  slug: "twingale-parry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "V8XBfRpDRJ:face:default",
      catalogId: "V8XBfRpDRJ",
      name: "Twingale Parry",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 combat damage that would be dealt to target unit this turn.\n\n[Class Bonus] Ephemerate — (2). Activate this card this way only if you control a Sword weapon. ",
      abilities: [
        {
          id: "V8XBfRpDRJ-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 combat damage that would be dealt to target unit this turn.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              combatDamage: true,
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "V8XBfRpDRJ-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ephemerate — (2). Activate this card this way only if you control a Sword weapon.",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            activationCondition: {
              kind: "controls",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["SWORD"],
                  },
                ],
              },
            },
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
      ],
    },
  },
};

export default twingaleParry;
