import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfKanaloa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "P8sbt2gXkn",
  slug: "lesser-boon-of-kanaloa",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "P8sbt2gXkn:face:default",
      catalogId: "P8sbt2gXkn",
      name: "Lesser Boon of Kanaloa",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, any number of target players put the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "P8sbt2gXkn-a1",
          kind: "triggered",
          text: "As you gain this boon, any number of target players put the top three cards of their deck into their graveyard.",
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
              id: "target-players",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-players",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default lesserBoonOfKanaloa;
