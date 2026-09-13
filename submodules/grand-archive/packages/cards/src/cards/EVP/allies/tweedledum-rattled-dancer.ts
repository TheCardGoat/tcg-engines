import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tweedledumRattledDancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UmZpK4rt2M",
  slug: "tweedledum-rattled-dancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UmZpK4rt2M:face:default",
      catalogId: "UmZpK4rt2M",
      name: "Tweedledum, Rattled Dancer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Stealth\n\nChoose an opponent as you declare an attack with Tweedledum rather than a target defender. That opponent chooses a valid unit they control as the target defender.",
      abilities: [
        {
          id: "UmZpK4rt2M-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "UmZpK4rt2M-a2",
          kind: "static",
          staticKind: "effects",
          text: "Choose an opponent as you declare an attack with Tweedledum rather than a target defender. That opponent chooses a valid unit they control as the target defender.",
          effects: [
            {
              kind: "attack-target-delegation",
              attacker: {
                kind: "source",
              },
              delegate: {
                chooser: "controller",
                players: "each-opponent",
                bindAs: "chosen-opponent",
              },
              defenderCandidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: {
                  binding: "chosen-opponent",
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default tweedledumRattledDancer;
