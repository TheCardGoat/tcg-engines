import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smashWithObelisk: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2kkvoqk1l7",
  slug: "smash-with-obelisk",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2kkvoqk1l7:face:default",
      catalogId: "2kkvoqk1l7",
      name: "Smash with Obelisk",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "OBELISK"],
      },
      elements: ["NEOS"],
      stats: {
        power: 6,
      },
      rulesText:
        "As an additional cost to activate this card, sacrifice a domain you control.\n\nSmash with Obelisk gets +X POWER where X is the reserve cost of the sacrificed domain.",
      abilities: [
        {
          id: "2kkvoqk1l7-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a domain you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "2kkvoqk1l7-a2",
          kind: "static",
          staticKind: "effects",
          text: "Smash with Obelisk gets +X POWER where X is the reserve cost of the sacrificed domain.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-object",
                },
                property: "reserve-cost",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default smashWithObelisk;
