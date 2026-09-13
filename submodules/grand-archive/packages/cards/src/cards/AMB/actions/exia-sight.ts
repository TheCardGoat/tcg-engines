import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exiaSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1fy8l4pxs9",
  slug: "exia-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1fy8l4pxs9:face:default",
      catalogId: "1fy8l4pxs9",
      name: "Exia Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card.\n\n[Damage 20+] The next card you activate this turn costs 1 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)",
      abilities: [
        {
          id: "1fy8l4pxs9-a1",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "1fy8l4pxs9-a2",
          kind: "card-resolution",
          text: "[Damage 20+] The next card you activate this turn costs 1 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)",
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
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
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

export default exiaSight;
