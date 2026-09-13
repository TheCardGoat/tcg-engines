import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanTailwindBoost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vNrkfKLlt6",
  slug: "aenean-tailwind-boost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vNrkfKLlt6:face:default",
      catalogId: "vNrkfKLlt6",
      name: "Aenean Tailwind Boost",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Wake up target ally. \n\n[Class Bonus] [Level 6+] That ally's next attack this turn gets +4POWER. (Apply this effect only if your champion’s class matches this card’s class and only if your champion is level 6 or higher.)",
      abilities: [
        {
          id: "vNrkfKLlt6-a1",
          kind: "card-resolution",
          text: "Wake up target ally.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "wake",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "vNrkfKLlt6-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 6+] That ally's next attack this turn gets +4POWER. (Apply this effect only if your champion’s class matches this card’s class and only if your champion is level 6 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
                  right: 6,
                },
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-1",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
                amount: 4,
              },
            },
          },
        },
      ],
    },
  },
};

export default aeneanTailwindBoost;
