import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const primordialRitual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4mcnqsm3n9",
  slug: "primordial-ritual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4mcnqsm3n9:face:default",
      catalogId: "4mcnqsm3n9",
      name: "Primordial Ritual",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally.\n\nTarget player puts the top two cards of their deck into their graveyard.\n\nFloating Memory",
      abilities: [
        {
          id: "4mcnqsm3n9-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice an ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4mcnqsm3n9-a2",
          kind: "card-resolution",
          text: "Target player puts the top two cards of their deck into their graveyard.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
        {
          id: "4mcnqsm3n9-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default primordialRitual;
