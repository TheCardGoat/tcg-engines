import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inductionStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WvWRLuPmDG",
  slug: "induction-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WvWRLuPmDG:face:default",
      catalogId: "WvWRLuPmDG",
      name: "Induction Strike",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 6,
      },
      rulesText:
        "(1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
      abilities: [
        {
          id: "WvWRLuPmDG-a1",
          kind: "activated",
          text: "(1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "banish-self",
              },
            ],
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "static",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default inductionStrike;
