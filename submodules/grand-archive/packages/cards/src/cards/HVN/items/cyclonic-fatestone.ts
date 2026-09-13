import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cyclonicFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l6410a85dn",
  slug: "cyclonic-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "l6410a85dn:face:default",
      catalogId: "l6410a85dn",
      name: "Cyclonic Fatestone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: Suppress target attacking ally you don't control.\n\n[Guo Jia Bonus] (3), REST: Transform Cyclonic Fatestone.",
      abilities: [
        {
          id: "l6410a85dn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "l6410a85dn-a2",
          kind: "triggered",
          text: "On Enter: Suppress target attacking ally you don't control.",
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
                player: "opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "l6410a85dn-a3",
          kind: "activated",
          text: "[Guo Jia Bonus] (3), REST: Transform Cyclonic Fatestone.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
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
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "l6410a85dn:face:flip",
      catalogId: "us6ou7utnx",
      name: "Windstalker Wolf",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "WOLF"],
      },
      elements: ["WIND"],
      stats: {
        power: 5,
        life: 5,
      },
      rulesText:
        "Pride 5 (This ally won’t obey you unless your champion is level 5 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
      abilities: [
        {
          id: "us6ou7utnx-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5 (This ally won’t obey you unless your champion is level 5 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
      ],
    },
  },
};

export default cyclonicFatestone;
