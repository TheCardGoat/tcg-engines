import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const razielArchangelOfLibra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ozpG6bt7nC",
  slug: "raziel-archangel-of-libra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ozpG6bt7nC:face:default",
      catalogId: "ozpG6bt7nC",
      name: "Raziel, Archangel of Libra",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Arcane & Astra Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are arcane and/or astra element, this card becomes imbued.)\n\nOn Enter: If Raziel is imbued, banish two cards at random from your memory. If you do, glimpse 3 and then put the top two cards of your deck into your memory.",
      abilities: [
        {
          id: "ozpG6bt7nC-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Arcane & Astra Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are arcane and/or astra element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: {
              oneOf: ["ARCANE", "ASTRA"],
            },
          },
        },
        {
          id: "ozpG6bt7nC-a2",
          kind: "triggered",
          text: "On Enter: If Raziel is imbued, banish two cards at random from your memory. If you do, glimpse 3 and then put the top two cards of your deck into your memory.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "choose",
              selection: {
                id: "random-banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
                method: "random",
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "random-banished-cards",
                    },
                    from: "memory",
                    destination: {
                      zone: "banishment",
                    },
                  },
                  {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 3,
                  },
                  {
                    kind: "choose",
                    selection: {
                      id: "top-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "top-cards",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "memory",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default razielArchangelOfLibra;
