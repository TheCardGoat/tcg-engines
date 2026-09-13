import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeAscension: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "N0ipz8UWwf",
  slug: "spirit-blade-ascension",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "N0ipz8UWwf:face:default",
      catalogId: "N0ipz8UWwf",
      name: "Spirit Blade: Ascension",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, return a Sword regalia you own to your material deck.\n\nChoose a Sword regalia card from your material deck or banishment and put it onto the field.",
      abilities: [
        {
          id: "N0ipz8UWwf-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, return a Sword regalia you own to your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "field",
                to: "material-deck",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
                relationship: "owned-by",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "N0ipz8UWwf-a2",
          kind: "card-resolution",
          text: "Choose a Sword regalia card from your material deck or banishment and put it onto the field.",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-multi-zone-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["material-deck", "banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "chosen-multi-zone-card",
              },
              destination: {
                zone: "field",
              },
            },
          },
        },
      ],
    },
  },
};

export default spiritBladeAscension;
