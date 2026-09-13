import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beseechingFlourish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d60jobz3ct",
  slug: "beseeching-flourish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d60jobz3ct:face:default",
      catalogId: "d60jobz3ct",
      name: "Beseeching Flourish",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Jin Bonus] On Hit: Materialize a Polearm weapon card from your material deck. (Apply this effect only if your champion is Jin. You still pay the costs for the materialization.)",
      abilities: [
        {
          id: "d60jobz3ct-a1",
          kind: "triggered",
          text: "[Jin Bonus] On Hit: Materialize a Polearm weapon card from your material deck. (Apply this effect only if your champion is Jin. You still pay the costs for the materialization.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
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
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default beseechingFlourish;
