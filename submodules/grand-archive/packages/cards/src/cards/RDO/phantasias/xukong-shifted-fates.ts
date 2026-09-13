import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const xukongShiftedFates: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Epmh7VncaR",
  slug: "xukong-shifted-fates",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Epmh7VncaR:face:default",
      catalogId: "Epmh7VncaR",
      name: "Xukong, Shifted Fates",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ULTIMATE", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "Spellshroud\n\n[Kongming Bonus] Whenever your Shifting Currents change to facing the opposite direction, reveal the top three cards of your deck and put them into your material deck preserved. Then deal 6+X damage to target unit you don't control where X is the amount of preserved cards in your material deck. \n\n",
      abilities: [
        {
          id: "Epmh7VncaR-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "Epmh7VncaR-a2",
          kind: "triggered",
          text: "[Kongming Bonus] Whenever your Shifting Currents change to facing the opposite direction, reveal the top three cards of your deck and put them into your material deck preserved. Then deal 6+X damage to target unit you don't control where X is the amount of preserved cards in your material deck.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                relation: "opposite",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "preserved",
                    },
                  ],
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
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "revealed-top-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 3,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                  },
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "revealed-top-cards",
                    },
                    from: "main-deck",
                    destination: {
                      zone: "material-deck",
                    },
                  },
                  {
                    kind: "set-object-state",
                    subject: {
                      kind: "bound",
                      binding: "revealed-top-cards",
                    },
                    state: "preserved",
                    value: true,
                  },
                ],
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    6,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default xukongShiftedFates;
