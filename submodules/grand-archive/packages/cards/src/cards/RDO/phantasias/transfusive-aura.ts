import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const transfusiveAura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7qWYuRNoYI",
  slug: "transfusive-aura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7qWYuRNoYI:face:default",
      catalogId: "7qWYuRNoYI",
      name: "Transfusive Aura",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Damage 20+] If you would recover an amount, recover 2+X instead, where X is that amount.",
      abilities: [
        {
          id: "7qWYuRNoYI-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "7qWYuRNoYI-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Damage 20+] If you would recover an amount, recover 2+X instead, where X is that amount.",
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "player-recovered",
                actor: "controller",
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default transfusiveAura;
