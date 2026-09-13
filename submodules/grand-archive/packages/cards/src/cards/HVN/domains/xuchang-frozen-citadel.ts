import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const xuchangFrozenCitadel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xpb20rar4k",
  slug: "xuchang-frozen-citadel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xpb20rar4k:face:default",
      catalogId: "xpb20rar4k",
      name: "Xuchang, Frozen Citadel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SIEGEABLE", "CASTLE"],
      },
      elements: ["WATER"],
      stats: {
        durability: 4,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nAt the beginning of each opponent's recollection phase, that player may banish a card with floating memory from their graveyard. If they don't, the next card they activate this turn costs 2 more to activate.",
      abilities: [
        {
          id: "xpb20rar4k-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "xpb20rar4k-a2",
          kind: "triggered",
          text: "At the beginning of each opponent's recollection phase, that player may banish a card with floating memory from their graveyard. If they don't, the next card they activate this turn costs 2 more to activate.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "opponent",
            },
          },
          effect: {
            kind: "optional",
            player: "event-actor",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "event-actor",
              selection: {
                id: "event-player-banished-card",
                kind: "choice",
                declared: "resolution",
                chooser: "event-actor",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "event-actor",
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              },
            },
            otherwise: {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "event-actor",
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
              duration: {
                kind: "for-next-event",
                event: "card-activated",
                expires: {
                  kind: "this-turn",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default xuchangFrozenCitadel;
