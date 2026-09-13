import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prideOfDemiourgos: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bupi7VU4of",
  slug: "pride-of-demiourgos",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bupi7VU4of:face:default",
      catalogId: "bupi7VU4of",
      name: "Pride of Demiourgos",
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
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Level 2+] (2), REST: Ignore the exalted elemental requirement for the next card you play this turn.",
      abilities: [
        {
          id: "bupi7VU4of-a1",
          kind: "activated",
          text: "[Level 2+] (2), REST: Ignore the exalted elemental requirement for the next card you play this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "ignore-element-requirement",
            subject: {
              kind: "player",
              player: "controller",
            },
            elementRequirement: "EXALTED",
            duration: {
              kind: "for-next-event",
              event: "card-played",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default prideOfDemiourgos;
