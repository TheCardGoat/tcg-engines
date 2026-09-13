import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veiledOracle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4dpp2s3neh",
  slug: "veiled-oracle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4dpp2s3neh:face:default",
      catalogId: "4dpp2s3neh",
      name: "Veiled Oracle",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Veiled Oracle becomes ephemeral. Glimpse 3. (If an ephemeral object would leave the field, banish it instead. To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "4dpp2s3neh-a1",
          kind: "triggered",
          text: "On Enter: Veiled Oracle becomes ephemeral. Glimpse 3. (If an ephemeral object would leave the field, banish it instead. To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                value: true,
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 3,
              },
            ],
          },
        },
      ],
    },
  },
};

export default veiledOracle;
