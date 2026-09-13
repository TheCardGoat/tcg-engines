import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zanderPreparedScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "T3CIBknts0",
  slug: "zander-prepared-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "T3CIBknts0:face:default",
      catalogId: "T3CIBknts0",
      name: "Zander, Prepared Scout",
      lineageName: "Zander",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: Glimpse 2. Put a preparation counter on Zander. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "T3CIBknts0-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 2. Put a preparation counter on Zander. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default zanderPreparedScout;
