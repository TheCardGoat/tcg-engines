import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfPurity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FUCJA8IAMi",
  slug: "spirit-of-purity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FUCJA8IAMi:face:default",
      catalogId: "FUCJA8IAMi",
      name: "Spirit of Purity",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["NORM"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText:
        "On Enter: Draw seven cards.\n\nLineage Release — Each player banishes two cards from their graveyard. (Activate this ability by banishing this card from your champion’s inner lineage.)",
      abilities: [
        {
          id: "FUCJA8IAMi-a1",
          kind: "triggered",
          text: "On Enter: Draw seven cards.",
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
            amount: 7,
          },
        },
        {
          id: "FUCJA8IAMi-a2",
          kind: "activated",
          text: "Lineage Release — Each player banishes two cards from their graveyard. (Activate this ability by banishing this card from your champion’s inner lineage.)",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "participating-player",
            effect: {
              kind: "banish",
              player: {
                binding: "participating-player",
              },
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "participating-player",
                },
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: {
                    binding: "participating-player",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default spiritOfPurity;
