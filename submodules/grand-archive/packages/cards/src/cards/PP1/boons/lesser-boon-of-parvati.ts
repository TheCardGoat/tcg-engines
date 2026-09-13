import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfParvati: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NidqQ6MOuy",
  slug: "lesser-boon-of-parvati",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "NidqQ6MOuy:face:default",
      catalogId: "NidqQ6MOuy",
      name: "Lesser Boon of Parvati",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, put six durability counters on a Siegeable domain you control or put three durability counters on a Siegeable domain you don't control.",
      abilities: [
        {
          id: "NidqQ6MOuy-a1",
          kind: "triggered",
          text: "As you gain this boon, put six durability counters on a Siegeable domain you control or put three durability counters on a Siegeable domain you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "siegeable-domain",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["DOMAIN"],
                    },
                    {
                      kind: "has-keyword",
                      keyword: "siegeable",
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "siegeable-domain",
              },
              counter: "durability",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "controls-subject",
                  player: "controller",
                  subject: {
                    kind: "bound",
                    binding: "siegeable-domain",
                  },
                },
                then: 6,
                else: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfParvati;
