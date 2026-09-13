import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lightveilAgent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jcaLgesx0e",
  slug: "lightveil-agent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jcaLgesx0e:face:default",
      catalogId: "jcaLgesx0e",
      name: "Lightveil Agent",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nWhenever you recover, put a buff counter on Lightveil Agent.",
      abilities: [
        {
          id: "jcaLgesx0e-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
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
          id: "jcaLgesx0e-a2",
          kind: "triggered",
          text: "Whenever you recover, put a buff counter on Lightveil Agent.",
          trigger: {
            kind: "event",
            event: {
              name: "player-recovered",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default lightveilAgent;
