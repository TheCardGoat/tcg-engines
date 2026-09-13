import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ashenRiffle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fjpimrl974",
  slug: "ashen-riffle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fjpimrl974:face:default",
      catalogId: "fjpimrl974",
      name: "Ashen Riffle",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal the top four cards of your deck. Banish up to two Suited non-action cards revealed this way and put the rest on the bottom of your deck in any order. For as long as those cards remain banished, you may activate them.",
      abilities: [
        {
          id: "fjpimrl974-a1",
          kind: "card-resolution",
          text: "Reveal the top four cards of your deck. Banish up to two Suited non-action cards revealed this way and put the rest on the bottom of your deck in any order. For as long as those cards remain banished, you may activate them.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-cards",
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
                  id: "banished-suited-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "revealed-cards",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["ACTION"],
                          },
                        },
                      ],
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
                        binding: "banished-suited-cards",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "banishment",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "revealed-cards",
                        excluding: "banished-suited-cards",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                    {
                      kind: "rule-modification",
                      mode: "allow",
                      action: "activate",
                      subject: {
                        kind: "bound",
                        binding: "banished-suited-cards",
                      },
                      fromZone: "banishment",
                      condition: {
                        kind: "subjects-in-zone",
                        subject: {
                          kind: "bound",
                          binding: "banished-suited-cards",
                        },
                        zone: "banishment",
                        quantifier: "all",
                      },
                      duration: {
                        kind: "while-condition",
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

export default ashenRiffle;
