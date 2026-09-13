import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostbind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z0fgm3pal7",
  slug: "frostbind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z0fgm3pal7:face:default",
      catalogId: "z0fgm3pal7",
      name: "Frostbind",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Negate target card activation unless its controller pays (2). Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "z0fgm3pal7-a1",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (2). Banish the card that had its activation negated this way.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default frostbind;
