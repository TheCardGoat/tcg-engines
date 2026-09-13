import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tricastlesOfLucenia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Ot9z4Oh3jN",
  slug: "tricastles-of-lucenia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Ot9z4Oh3jN:face:default",
      catalogId: "Ot9z4Oh3jN",
      name: "Tricastles of Lucenia",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SIEGEABLE", "CASTLE"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        durability: 8,
      },
      rulesText:
        "Players can't activate non-advanced element cards.\n\nBanish a norm or advanced element card from your hand:  Tricastles of Lucenia loses all abilities until end of turn. Any player may activate this ability. Activate this ability only once per turn. ",
      abilities: [
        {
          id: "Ot9z4Oh3jN-a1",
          kind: "static",
          staticKind: "effects",
          text: "Players can't activate non-advanced element cards.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "activate",
              subject: {
                kind: "player",
                player: "each-player",
              },
              filter: {
                kind: "element-category",
                value: "non-advanced",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Ot9z4Oh3jN-a2",
          kind: "activated",
          text: "Banish a norm or advanced element card from your hand:  Tricastles of Lucenia loses all abilities until end of turn. Any player may activate this ability. Activate this ability only once per turn.",
          activation: "ability",
          cost: {
            kind: "select-and-move",
            player: "controller",
            from: "hand",
            to: "banishment",
            count: {
              kind: "exactly",
              amount: 1,
            },
            filter: {
              kind: "any",
              filters: [
                {
                  kind: "element",
                  oneOf: ["NORM"],
                },
                {
                  kind: "element-category",
                  value: "advanced",
                },
              ],
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "remove-abilities",
            },
          },
          activationAuthority: "any-player",
        },
      ],
    },
  },
};

export default tricastlesOfLucenia;
