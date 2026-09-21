import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rangerStrides: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pvxb5hrfsu",
  slug: "ranger-strides",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pvxb5hrfsu:face:default",
      catalogId: "pvxb5hrfsu",
      name: "Ranger Strides",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "DISTORTION", "ACCESSORY"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\nBanish Ranger Strides: Target Ranger unit gains ranged 4 until end of turn. (As long as that unit is distant, its attacks get +4POWER.)",
      abilities: [
        {
          id: "pvxb5hrfsu-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            amount: 1,
          },
        },
        {
          id: "pvxb5hrfsu-a2",
          kind: "activated",
          text: "Banish Ranger Strides: Target Ranger unit gains ranged 4 until end of turn. (As long as that unit is distant, its attacks get +4POWER.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-1",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "class",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "ranged",
                value: 4,
              },
            },
          },
        },
      ],
    },
  },
};

export default rangerStrides;
