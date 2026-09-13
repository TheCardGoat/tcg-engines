import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cosmicAstroscope: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qj5bbae3z4",
  slug: "cosmic-astroscope",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qj5bbae3z4:face:default",
      catalogId: "qj5bbae3z4",
      name: "Cosmic Astroscope",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "STAFF"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Class Bonus] If an opponent would glimpse, you may have that player glimpse 3 instead.\n\nREST: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "qj5bbae3z4-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If an opponent would glimpse, you may have that player glimpse 3 instead.",
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
          effects: [
            {
              kind: "replacement",
              event: {
                name: "keyword-action-performed",
                actor: "opponent",
                action: "glimpse",
              },
              optionalFor: "controller",
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  player: "event-actor",
                  amount: 3,
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "qj5bbae3z4-a2",
          kind: "activated",
          text: "REST: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default cosmicAstroscope;
