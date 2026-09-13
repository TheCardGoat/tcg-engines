import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightsRing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u8LjHnH6iC",
  slug: "blights-ring",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u8LjHnH6iC:face:default",
      catalogId: "u8LjHnH6iC",
      name: "Blight's Ring",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "RING"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "(4), REST: Draw a card into your memory. Then put Blight's Ring on the bottom of target champion's lineage.\n\nInherited Effect —  At the beginning of your recollection phase, deal 1 unpreventable damage to this object.",
      abilities: [
        {
          id: "u8LjHnH6iC-a1",
          kind: "activated",
          text: "(4), REST: Draw a card into your memory. Then put Blight's Ring on the bottom of target champion's lineage.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-champion",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "bound",
                    binding: "target-champion",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
            ],
          },
        },
        {
          id: "u8LjHnH6iC-a2",
          kind: "triggered",
          text: "Inherited Effect —  At the beginning of your recollection phase, deal 1 unpreventable damage to this object.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "ability-bearer",
            },
            amount: 1,
            preventable: false,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default blightsRing;
