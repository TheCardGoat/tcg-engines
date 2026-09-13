import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const martialFlowstate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fekR8D4FpB",
  slug: "martial-flowstate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fekR8D4FpB:face:default",
      catalogId: "fekR8D4FpB",
      name: "Martial Flowstate",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] Whenever your champion levels up, sacrifice Martial Flowstate, draw a card into your memory, and your champion's next attack this turn gets +2POWER.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "fekR8D4FpB-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever your champion levels up, sacrifice Martial Flowstate, draw a card into your memory, and your champion's next attack this turn gets +2POWER.",
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
            kind: "choose",
            selection: {
              id: "sacrificed-object",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            effect: {
              kind: "sacrifice",
              subject: {
                kind: "bound",
                binding: "sacrificed-object",
              },
            },
          },
        },
        {
          id: "fekR8D4FpB-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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

export default martialFlowstate;
