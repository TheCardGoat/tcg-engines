import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hanielArchangelOfSpectra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "suH40WW60W",
  slug: "haniel-archangel-of-spectra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "suH40WW60W:face:default",
      catalogId: "suH40WW60W",
      name: "Haniel, Archangel of Spectra",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Luxem & Umbra Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are luxem and/or umbra element, this card becomes imbued.)\n\nOn Enter: If Haniel is imbued, put a debuff counter on target ally you don't control, put a buff counter on Haniel, and recover 1.",
      abilities: [
        {
          id: "suH40WW60W-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Luxem & Umbra Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are luxem and/or umbra element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: {
              oneOf: ["LUXEM", "UMBRA"],
            },
          },
        },
        {
          id: "suH40WW60W-a2",
          kind: "triggered",
          text: "On Enter: If Haniel is imbued, put a debuff counter on target ally you don't control, put a buff counter on Haniel, and recover 1.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "debuff",
                  amount: 1,
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
                {
                  kind: "recover",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default hanielArchangelOfSpectra;
