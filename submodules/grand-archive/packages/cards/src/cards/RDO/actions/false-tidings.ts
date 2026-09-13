import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const falseTidings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OgqsRSQVX6",
  slug: "false-tidings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OgqsRSQVX6:face:default",
      catalogId: "OgqsRSQVX6",
      name: "False Tidings",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target opponent gains control of target Crystal object you control. If they do, you draw two cards.\n\n",
      abilities: [
        {
          id: "OgqsRSQVX6-a1",
          kind: "card-resolution",
          text: "Target opponent gains control of target Crystal object you control. If they do, you draw two cards.",
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
            {
              id: "target-crystal",
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
                  kind: "subtype",
                  oneOf: ["CRYSTAL"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "control-transferred",
                effect: {
                  kind: "change-control",
                  subject: {
                    kind: "bound",
                    binding: "target-crystal",
                  },
                  controller: {
                    binding: "target-opponent",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "control-transferred",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default falseTidings;
