import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poweredDefender: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z07nau5sw9",
  slug: "powered-defender",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z07nau5sw9:face:default",
      catalogId: "z07nau5sw9",
      name: "Powered Defender",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Taunt (While awake, this unit must be targeted before other units you control during your opponents’ attack declarations if able.)\n\nWhenever Powered Defender is dealt damage, summon a Powercell token.",
      abilities: [
        {
          id: "z07nau5sw9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] [Level 2+] Taunt (While awake, this unit must be targeted before other units you control during your opponents’ attack declarations if able.)",
          keyword: {
            name: "taunt",
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
        },
        {
          id: "z07nau5sw9-a2",
          kind: "triggered",
          text: "Whenever Powered Defender is dealt damage, summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default poweredDefender;
