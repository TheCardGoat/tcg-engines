import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireHeadhunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r278evrcdz",
  slug: "gloamspire-headhunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r278evrcdz:face:default",
      catalogId: "r278evrcdz",
      name: "Gloamspire Headhunter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\n[Class Bonus] On Ally Hit: Destroy the hit ally unless its controller pays (3).",
      abilities: [
        {
          id: "r278evrcdz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "r278evrcdz-a2",
          kind: "triggered",
          text: "[Class Bonus] On Ally Hit: Destroy the hit ally unless its controller pays (3).",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
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
          effect: {
            kind: "unless-paid",
            player: "event-recipient-controller",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
            otherwise: {
              kind: "destroy",
              subject: {
                kind: "event-recipient",
              },
            },
          },
        },
      ],
    },
  },
};

export default gloamspireHeadhunter;
