import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sealThePast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2m31946aki",
  slug: "seal-the-past",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2m31946aki:face:default",
      catalogId: "2m31946aki",
      name: "Seal the Past",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target player banishes three preserved cards from their material deck.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "2m31946aki-a1",
          kind: "card-resolution",
          text: "Target player banishes three preserved cards from their material deck.",
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
            kind: "banish",
            player: {
              binding: "target-player",
            },
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              count: {
                kind: "exactly",
                amount: 3,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: {
                  binding: "target-player",
                },
                filter: {
                  kind: "object-state",
                  state: "preserved",
                },
              },
            },
          },
        },
        {
          id: "2m31946aki-a2",
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

export default sealThePast;
