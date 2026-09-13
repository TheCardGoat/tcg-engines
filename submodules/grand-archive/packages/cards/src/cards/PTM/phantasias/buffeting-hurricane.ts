import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const buffetingHurricane: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CjL1WPvWHw",
  slug: "buffeting-hurricane",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CjL1WPvWHw:face:default",
      catalogId: "CjL1WPvWHw",
      name: "Buffeting Hurricane",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus] On Enter: Draw a card into your memory.\n\n[Class Bonus] Whenever you suppress an object, deal 2 damage to target champion.",
      abilities: [
        {
          id: "CjL1WPvWHw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "CjL1WPvWHw-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "CjL1WPvWHw-a3",
          kind: "triggered",
          text: "[Class Bonus] Whenever you suppress an object, deal 2 damage to target champion.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "suppress",
              subject: {
                kind: "event-object",
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
            amount: 2,
          },
        },
      ],
    },
  },
};

export default buffetingHurricane;
