import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blackIceSpellweaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "M5LHimBiCn",
  slug: "black-ice-spellweaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "M5LHimBiCn:face:default",
      catalogId: "M5LHimBiCn",
      name: "Black Ice Spellweaver",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.) \n\nSacrifice Black Ice Spellweaver: Target unit's attacks get -3POWER until end of turn.",
      abilities: [
        {
          id: "M5LHimBiCn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "M5LHimBiCn-a2",
          kind: "activated",
          text: "Sacrifice Black Ice Spellweaver: Target unit's attacks get -3POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
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
                  oneOf: ["ALLY", "CHAMPION"],
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
                operation: "subtract",
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default blackIceSpellweaver;
