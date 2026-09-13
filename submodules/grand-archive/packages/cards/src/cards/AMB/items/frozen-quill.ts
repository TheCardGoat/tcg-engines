import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frozenQuill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iqcknwa2vl",
  slug: "frozen-quill",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iqcknwa2vl:face:default",
      catalogId: "iqcknwa2vl",
      name: "Frozen Quill",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ARROW"],
      },
      elements: ["WATER"],
      stats: {
        power: 4,
      },
      rulesText:
        "REST: Load Frozen Quill into target unloaded Bow weapon you control.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "iqcknwa2vl-a1",
          kind: "activated",
          text: "REST: Load Frozen Quill into target unloaded Bow weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BOW"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "iqcknwa2vl-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default frozenQuill;
