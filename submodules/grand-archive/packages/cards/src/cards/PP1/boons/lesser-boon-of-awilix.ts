import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfAwilix: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jQMIfe3Xvw",
  slug: "lesser-boon-of-awilix",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "jQMIfe3Xvw:face:default",
      catalogId: "jQMIfe3Xvw",
      name: "Lesser Boon of Awilix",
      cost: {
        kind: "reserve",
        amount: 0,
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
        "As you gain this boon, put up to four target regalia cards from any banishment into their owner’s material deck.",
      abilities: [
        {
          id: "jQMIfe3Xvw-a1",
          kind: "triggered",
          text: "As you gain this boon, put up to four target regalia cards from any banishment into their owner’s material deck.",
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
              id: "target-cards",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 4,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-cards",
            },
            from: "banishment",
            destination: {
              zone: "material-deck",
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfAwilix;
