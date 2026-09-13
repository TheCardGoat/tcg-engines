import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dusksoulStone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u25fuv184p",
  slug: "dusksoul-stone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u25fuv184p:face:default",
      catalogId: "u25fuv184p",
      name: "Dusksoul Stone",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "BAUBLE"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "As an additional cost to materialize this card, banish two ally cards from a single graveyard.\n\nPhantasias you control have spellshroud. (Objects with spellshroud can't be targeted by Spells.)\n\nBanish Dusksoul Stone: Banish up to two cards from a single graveyard.",
      abilities: [
        {
          id: "u25fuv184p-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this card, banish two ally cards from a single graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "each-player",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                singleZoneOwner: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "u25fuv184p-a2",
          kind: "static",
          staticKind: "effects",
          text: "Phantasias you control have spellshroud. (Objects with spellshroud can't be targeted by Spells.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "spellshroud",
                },
              },
            },
          ],
        },
        {
          id: "u25fuv184p-a3",
          kind: "activated",
          text: "Banish Dusksoul Stone: Banish up to two cards from a single graveyard.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
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
};

export default dusksoulStone;
