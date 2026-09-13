import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const solarPinnacle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zeig1e49wb",
  slug: "solar-pinnacle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zeig1e49wb:face:default",
      catalogId: "zeig1e49wb",
      name: "Solar Pinnacle",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As long as your Shifting Currents face North, this card has Fast Activation. (You may activate this card at fast speed.)\n\nDeal 2 damage to target unit. Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.) ",
      abilities: [
        {
          id: "zeig1e49wb-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face North, this card has Fast Activation. (You may activate this card at fast speed.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "North",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "fast-activation",
                },
              },
            },
          ],
        },
        {
          id: "zeig1e49wb-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default solarPinnacle;
