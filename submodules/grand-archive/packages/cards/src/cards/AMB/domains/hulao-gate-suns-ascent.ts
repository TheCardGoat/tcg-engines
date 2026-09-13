import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hulaoGateSunsAscent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "snke7lneo4",
  slug: "hulao-gate-suns-ascent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "snke7lneo4:face:default",
      catalogId: "snke7lneo4",
      name: "Hulao Gate, Sun's Ascent",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CROSSROADS"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Whenever a unit declares an attack, deal 2 damage to it.\n\nUpkeep — At the beginning of your recollection phase, you may banish a fire element card from your graveyard. If you don't, sacrifice Hulao Gate.",
      abilities: [
        {
          id: "snke7lneo4-a1",
          kind: "triggered",
          text: "Whenever a unit declares an attack, deal 2 damage to it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "event-subject",
            },
            amount: 2,
          },
        },
        {
          id: "snke7lneo4-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, you may banish a fire element card from your graveyard. If you don't, sacrifice Hulao Gate.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
              },
            },
            otherwise: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default hulaoGateSunsAscent;
