import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcanistsPrism: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dIEAN4J4YS",
  slug: "arcanists-prism",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dIEAN4J4YS:face:default",
      catalogId: "dIEAN4J4YS",
      name: "Arcanist's Prism",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, put all cards from your memory on the bottom of your deck in any order, then draw that many cards.",
      abilities: [
        {
          id: "dIEAN4J4YS-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put all cards from your memory on the bottom of your deck in any order, then draw that many cards.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "all-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "all-memory-cards",
                  },
                  from: "memory",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
                    },
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "count",
                  collection: {
                    binding: "all-memory-cards",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default arcanistsPrism;
