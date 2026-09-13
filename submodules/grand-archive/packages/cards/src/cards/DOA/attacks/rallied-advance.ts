import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ralliedAdvance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SPESFtKHLw",
  slug: "rallied-advance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SPESFtKHLw:face:default",
      catalogId: "SPESFtKHLw",
      name: "Rallied Advance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: Wake up target ally you control. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "SPESFtKHLw-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Wake up target ally you control. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                  kind: "type",
                  oneOf: ["ALLY"],
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
            kind: "wake",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default ralliedAdvance;
