import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const keepOfTheGoldenSashes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gjhv2etytr",
  slug: "keep-of-the-golden-sashes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gjhv2etytr:face:default",
      catalogId: "gjhv2etytr",
      name: "Keep of the Golden Sashes",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "The first card your opponents activate each turn costs 1 more to activate.\n\nUpkeep — At the beginning of your recollection phase, you may banish two cards from your graveyard. If you don't, sacrifice Keep of the Golden Sashes.",
      abilities: [
        {
          id: "gjhv2etytr-a1",
          kind: "static",
          staticKind: "effects",
          text: "The first card your opponents activate each turn costs 1 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "gjhv2etytr-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, you may banish two cards from your graveyard. If you don't, sacrifice Keep of the Golden Sashes.",
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
                  amount: 2,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
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

export default keepOfTheGoldenSashes;
