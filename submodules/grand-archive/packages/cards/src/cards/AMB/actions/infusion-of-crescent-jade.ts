import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const infusionOfCrescentJade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "91jnc6v71t",
  slug: "infusion-of-crescent-jade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "91jnc6v71t:face:default",
      catalogId: "91jnc6v71t",
      name: "Infusion of Crescent Jade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target Polearm weapon gets +1 POWER until end of turn for each wind element non-champion object you control.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "91jnc6v71t-a1",
          kind: "card-resolution",
          text: "Target Polearm weapon gets +1 POWER until end of turn for each wind element non-champion object you control.",
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
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POLEARM"],
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
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        {
          id: "91jnc6v71t-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default infusionOfCrescentJade;
