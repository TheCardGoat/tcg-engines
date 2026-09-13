import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const solarProvidence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gnj9hi5ult",
  slug: "solar-providence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gnj9hi5ult:face:default",
      catalogId: "gnj9hi5ult",
      name: "Solar Providence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card, then discard a card.\n\n[Kongming Bonus] You may change the direction of your Shifting Currents to a different direction of your choice. When you change it from facing South to North this way, deal 3 damage to target champion.",
      abilities: [
        {
          id: "gnj9hi5ult-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
        {
          id: "gnj9hi5ult-a2",
          kind: "card-resolution",
          text: "[Kongming Bonus] You may change the direction of your Shifting Currents to a different direction of your choice. When you change it from facing South to North this way, deal 3 damage to target champion.",
          targets: [
            {
              id: "target-champion",
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
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
                      from: "south",
                      to: "north",
                    },
                    minimum: 1,
                  },
                  then: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-champion",
                    },
                    amount: 3,
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

export default solarProvidence;
