import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dredgingStreams: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wmt0x5zado",
  slug: "dredging-streams",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wmt0x5zado:face:default",
      catalogId: "wmt0x5zado",
      name: "Dredging Streams",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish target card from a graveyard. \n\n[Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "wmt0x5zado-a1",
          kind: "card-resolution",
          text: "Banish target card from a graveyard.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "banish-object",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
          },
        },
        {
          id: "wmt0x5zado-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion is level 2 or higher.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default dredgingStreams;
