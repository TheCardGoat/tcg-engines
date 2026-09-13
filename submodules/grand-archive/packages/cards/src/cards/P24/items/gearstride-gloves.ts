import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gearstrideGloves: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lcb6jhxctx",
  slug: "gearstride-gloves",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lcb6jhxctx:face:default",
      catalogId: "lcb6jhxctx",
      name: "Gearstride Gloves",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "GLOVES"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Put a preparation counter on your champion.\n\n[Class Bonus] [Level 2+] Banish Gearstride Gloves: The next Reaction card you activate this turn costs 1 less to activate.",
      abilities: [
        {
          id: "lcb6jhxctx-a1",
          kind: "triggered",
          text: "On Enter: Put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
        {
          id: "lcb6jhxctx-a2",
          kind: "activated",
          text: "[Class Bonus] [Level 2+] Banish Gearstride Gloves: The next Reaction card you activate this turn costs 1 less to activate.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "subtype",
              oneOf: ["REACTION"],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 1,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default gearstrideGloves;
