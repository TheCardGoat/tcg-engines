import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enfeeblingOrb: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "T3cx65VM3D",
  slug: "enfeebling-orb",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "T3cx65VM3D:face:default",
      catalogId: "T3cx65VM3D",
      name: "Enfeebling Orb",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Enfeebling Orb: Target opponent puts two cards from their hand into their memory.",
      abilities: [
        {
          id: "T3cx65VM3D-a1",
          kind: "activated",
          text: "Banish Enfeebling Orb: Target opponent puts two cards from their hand into their memory.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-opponent",
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
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "hand-cards-to-memory",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-opponent",
              },
              count: {
                kind: "exactly",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: {
                  binding: "target-opponent",
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "hand-cards-to-memory",
              },
              from: "hand",
              destination: {
                zone: "memory",
              },
            },
          },
        },
      ],
    },
  },
};

export default enfeeblingOrb;
