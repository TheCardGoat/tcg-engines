import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfDux: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QLWT8BnvlU",
  slug: "lesser-boon-of-dux",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "QLWT8BnvlU:face:default",
      catalogId: "QLWT8BnvlU",
      name: "Lesser Boon of Dux",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\nAs you gain this boon, choose an ally and it becomes fostered.",
      abilities: [
        {
          id: "QLWT8BnvlU-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked (Play this card only if your champion’s class matches this card’s class.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "QLWT8BnvlU-a2",
          kind: "triggered",
          text: "As you gain this boon, choose an ally and it becomes fostered.",
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
              id: "chosen-object",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            effect: {
              kind: "set-object-state",
              subject: {
                kind: "bound",
                binding: "chosen-object",
              },
              state: "fostered",
              value: true,
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfDux;
