import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nullifyingMirror: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pol1nz0j1n",
  slug: "nullifying-mirror",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pol1nz0j1n:face:default",
      catalogId: "pol1nz0j1n",
      name: "Nullifying Mirror",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Until end of turn, cards in target opponent’s memory are norm element. (They are not any other element.)",
      abilities: [
        {
          id: "pol1nz0j1n-a1",
          kind: "activated",
          text: "REST: Until end of turn, cards in target opponent’s memory are norm element. (They are not any other element.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["memory"],
                player: {
                  binding: "target-opponent",
                },
              },
            },
            affectedSet: "dynamic",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "C",
              modifies: "element",
            },
            change: {
              kind: "set-elements",
              elements: ["NORM"],
            },
          },
        },
      ],
    },
  },
};

export default nullifyingMirror;
