import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const temptationsFacade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ww4akrkn1d",
  slug: "temptations-facade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ww4akrkn1d:face:default",
      catalogId: "ww4akrkn1d",
      name: "Temptation's Facade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Nico Bonus] REST: Change the target of an activation that targets another non-champion object you control to Temptation's Facade.",
      abilities: [
        {
          id: "ww4akrkn1d-a1",
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
          id: "ww4akrkn1d-a2",
          kind: "activated",
          text: "[Nico Bonus] REST: Change the target of an activation that targets another non-champion object you control to Temptation's Facade.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["ability", "card-activation"],
                targeting: {
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Nico",
              },
            },
          ],
          effect: {
            kind: "retarget",
            subject: {
              kind: "bound",
              binding: "target-activation",
            },
            chooser: "controller",
            newTarget: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default temptationsFacade;
