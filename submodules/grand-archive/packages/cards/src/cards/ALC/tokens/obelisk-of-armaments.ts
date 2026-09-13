import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obeliskOfArmaments: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "wk0pw0y6is",
  slug: "obelisk-of-armaments",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "wk0pw0y6is:face:default",
      catalogId: "wk0pw0y6is",
      name: "Obelisk of Armaments",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "OBELISK"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "(5), REST: Summon an Aurousteel Greatsword token. This ability costs (1) less to activate for each domain you control.",
      abilities: [
        {
          id: "wk0pw0y6is-a1",
          kind: "activated",
          text: "(5), REST: Summon an Aurousteel Greatsword token. This ability costs (1) less to activate for each domain you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Aurousteel Greatsword",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default obeliskOfArmaments;
