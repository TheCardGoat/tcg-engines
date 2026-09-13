import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fluvialFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3h93tgm72l",
  slug: "fluvial-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "3h93tgm72l:face:default",
      catalogId: "3h93tgm72l",
      name: "Fluvial Fatestone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: Target ally you control gets +2 LIFE until end of turn.\n\n[Guo Jia Bonus] (4), REST: Put the top two cards of your deck into your graveyard. Transform Fluvial Fatestone.",
      abilities: [
        {
          id: "3h93tgm72l-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "3h93tgm72l-a2",
          kind: "triggered",
          text: "On Enter: Target ally you control gets +2 LIFE until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "life",
              operation: "add",
              amount: 2,
            },
          },
        },
        {
          id: "3h93tgm72l-a3",
          kind: "activated",
          text: "[Guo Jia Bonus] (4), REST: Put the top two cards of your deck into your graveyard. Transform Fluvial Fatestone.",
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: 2,
              },
              {
                kind: "transform",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "3h93tgm72l:face:flip",
      catalogId: "oo0p7gxtf3",
      name: "Mocking Otter",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "OTTER"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)\n\nRetort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
      abilities: [
        {
          id: "oo0p7gxtf3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "oo0p7gxtf3-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
          keyword: {
            name: "retort",
            value: 2,
          },
        },
      ],
    },
  },
};

export default fluvialFatestone;
