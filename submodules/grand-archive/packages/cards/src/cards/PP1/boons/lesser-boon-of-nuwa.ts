import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfNuwa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CW73nq8jCR",
  slug: "lesser-boon-of-nuwa",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "CW73nq8jCR:face:default",
      catalogId: "CW73nq8jCR",
      name: "Lesser Boon of Nuwa",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion's class matches this card's class.)\n\nAs you gain this boon, generate a Refurbish card and put it into your memory.\n\nWhenever you activate a Craft card, target weapon gets +1POWER until end of turn.\n",
      abilities: [
        {
          id: "CW73nq8jCR-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked (Play this card only if your champion's class matches this card's class.)",
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
          id: "CW73nq8jCR-a2",
          kind: "triggered",
          text: "As you gain this boon, generate a Refurbish card and put it into your memory.",
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
            kind: "generate",
            card: "Refurbish",
            player: "controller",
            destination: {
              zone: "memory",
            },
          },
        },
        {
          id: "CW73nq8jCR-a3",
          kind: "triggered",
          text: "Whenever you activate a Craft card, target weapon gets +1POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["CRAFT"],
                },
              },
            },
          },
          targets: [
            {
              id: "target-1",
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
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfNuwa;
