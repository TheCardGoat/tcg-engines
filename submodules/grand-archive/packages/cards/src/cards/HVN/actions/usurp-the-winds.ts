import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const usurpTheWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ulzrh3pmxq",
  slug: "usurp-the-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ulzrh3pmxq:face:default",
      catalogId: "ulzrh3pmxq",
      name: "Usurp the Winds",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Up to one target ally gets +1 POWER and +1 LIFE until end of turn.\n\n[Kongming Bonus] You may change the direction of your Shifting Currents to a different direction of your choice. When you change it from facing West to South this way, draw a card.",
      abilities: [
        {
          id: "ulzrh3pmxq-a1",
          kind: "card-resolution",
          text: "Up to one target ally gets +1 POWER and +1 LIFE until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
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
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "ulzrh3pmxq-a2",
          kind: "card-resolution",
          text: "[Kongming Bonus] You may change the direction of your Shifting Currents to a different direction of your choice. When you change it from facing West to South this way, draw a card.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "choose-direction",
                  player: "controller",
                  state: "shifting-currents",
                  directions: ["north", "east", "south", "west"],
                  differentFromCurrent: true,
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "history",
                    event: "player-state-changed",
                    window: "this-resolution",
                    actor: "controller",
                    directionTransition: {
                      from: "west",
                      to: "south",
                    },
                    minimum: 1,
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default usurpTheWinds;
