import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sashaPurifyingAcolyte: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GRlUlcYRmV",
  slug: "sasha-purifying-acolyte",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GRlUlcYRmV:face:default",
      catalogId: "GRlUlcYRmV",
      name: "Sasha, Purifying Acolyte",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)\n\nOn Foster: Banish all cards in all graveyards.\n\nIf one or more cards would enter a player's graveyard while Sasha is fostered, banish them instead.",
      abilities: [
        {
          id: "GRlUlcYRmV-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "GRlUlcYRmV-a2",
          kind: "triggered",
          text: "On Foster: Banish all cards in all graveyards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "banish",
            player: "each-player",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "each-player",
              count: {
                kind: "all",
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "each-player",
              },
            },
          },
        },
        {
          id: "GRlUlcYRmV-a3",
          kind: "static",
          staticKind: "effects",
          text: "If one or more cards would enter a player's graveyard while Sasha is fostered, banish them instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-moved",
                subject: {
                  kind: "event-object",
                },
                to: "graveyard",
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "event-subject",
                  },
                },
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

export default sashaPurifyingAcolyte;
