import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfInsight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rp5k1vt1cn",
  slug: "fractal-of-insight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rp5k1vt1cn:face:default",
      catalogId: "rp5k1vt1cn",
      name: "Fractal of Insight",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FRACTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: You may rest Fractal of Insight. If you do, glimpse 2.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "rp5k1vt1cn-a1",
          kind: "triggered",
          text: "On Enter: You may rest Fractal of Insight. If you do, glimpse 2.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
        {
          id: "rp5k1vt1cn-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default fractalOfInsight;
