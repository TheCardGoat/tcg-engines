import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcaneDisposition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "blq7qXGvWH",
  slug: "arcane-disposition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "blq7qXGvWH:face:default",
      catalogId: "blq7qXGvWH",
      name: "Arcane Disposition",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw two cards. At the beginning of the next end phase, discard your hand.\n\n[Class Bonus:] Draw a card.",
      abilities: [
        {
          id: "blq7qXGvWH-a1",
          kind: "card-resolution",
          text: "Draw two cards. At the beginning of the next end phase, discard your hand.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                  },
                },
                effect: {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-hand",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "all",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "blq7qXGvWH-a2",
          kind: "card-resolution",
          text: "[Class Bonus:] Draw a card.",
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
          },
        },
      ],
    },
  },
};

export default arcaneDisposition;
