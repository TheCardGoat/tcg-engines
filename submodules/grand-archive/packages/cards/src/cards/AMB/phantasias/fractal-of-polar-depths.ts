import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfPolarDepths: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5fnmnpavo4",
  slug: "fractal-of-polar-depths",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5fnmnpavo4:face:default",
      catalogId: "5fnmnpavo4",
      name: "Fractal of Polar Depths",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\n[Class Bonus] Sacrifice Fractal of Polar Depths: Target player puts the top X cards from their deck into their graveyard, where X is the amount of water element cards in your graveyard.",
      abilities: [
        {
          id: "5fnmnpavo4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "5fnmnpavo4-a2",
          kind: "activated",
          text: "[Class Bonus] Sacrifice Fractal of Polar Depths: Target player puts the top X cards from their deck into their graveyard, where X is the amount of water element cards in your graveyard.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          ],
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
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: {
              kind: "count",
              collection: {
                zones: ["graveyard"],
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["WATER"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default fractalOfPolarDepths;
