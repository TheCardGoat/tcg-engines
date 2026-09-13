import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tweedledeeContrarianPoet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EwUKdNL4bk",
  slug: "tweedledee-contrarian-poet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EwUKdNL4bk:face:default",
      catalogId: "EwUKdNL4bk",
      name: "Tweedledee, Contrarian Poet",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Taunt\n\nOn Hit: Tweedledee gets -3 POWER. (This effect lasts indefinitely.)",
      abilities: [
        {
          id: "EwUKdNL4bk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt",
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
          ],
        },
        {
          id: "EwUKdNL4bk-a2",
          kind: "triggered",
          text: "On Hit: Tweedledee gets -3 POWER. (This effect lasts indefinitely.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
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
      ],
    },
  },
};

export default tweedledeeContrarianPoet;
