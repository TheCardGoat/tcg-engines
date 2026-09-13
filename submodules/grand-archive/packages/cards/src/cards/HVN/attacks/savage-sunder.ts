import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const savageSunder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5mnvohcd0o",
  slug: "savage-sunder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5mnvohcd0o:face:default",
      catalogId: "5mnvohcd0o",
      name: "Savage Sunder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
      },
      rulesText: "[Class Bonus] On Hit: You may recover 5.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "5mnvohcd0o-a1",
          kind: "triggered",
          text: "[Class Bonus] On Hit: You may recover 5.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "recover",
              player: "controller",
              amount: 5,
            },
          },
        },
        {
          id: "5mnvohcd0o-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default savageSunder;
