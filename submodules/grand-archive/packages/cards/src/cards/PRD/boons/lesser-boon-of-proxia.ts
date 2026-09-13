import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfProxia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bHMPShtaSt",
  slug: "lesser-boon-of-proxia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bHMPShtaSt:face:default",
      catalogId: "bHMPShtaSt",
      name: "Lesser Boon of Proxia",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, summon a token copy of target regalia you don't control with memory cost 0.",
      abilities: [
        {
          id: "bHMPShtaSt-a1",
          kind: "triggered",
          text: "As you gain this boon, summon a token copy of target regalia you don't control with memory cost 0.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "copied-object",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "memory-cost",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 0,
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            copyOf: {
              kind: "bound",
              binding: "copied-object",
            },
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default lesserBoonOfProxia;
