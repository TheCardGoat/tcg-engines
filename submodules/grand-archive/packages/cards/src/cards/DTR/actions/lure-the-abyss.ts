import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lureTheAbyss: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gqh3mw478q",
  slug: "lure-the-abyss",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gqh3mw478q:face:default",
      catalogId: "gqh3mw478q",
      name: "Lure the Abyss",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal the top four cards of your deck. Put all Specter cards from among them into your graveyard and the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "gqh3mw478q-a1",
          kind: "card-resolution",
          text: "Reveal the top four cards of your deck. Put all Specter cards from among them into your graveyard and the rest on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "selected-referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "selected-referenced-cards",
                      },
                      destination: {
                        zone: "graveyard",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "referenced-cards",
                        excluding: "selected-referenced-cards",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default lureTheAbyss;
