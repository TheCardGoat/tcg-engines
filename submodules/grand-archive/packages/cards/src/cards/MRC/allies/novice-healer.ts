import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const noviceHealer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b9p4lgdlx7",
  slug: "novice-healer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b9p4lgdlx7:face:default",
      catalogId: "b9p4lgdlx7",
      name: "Novice Healer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Recover 3. (To recover, remove that many damage counters from your champion. Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "b9p4lgdlx7-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Recover 3. (To recover, remove that many damage counters from your champion. Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default noviceHealer;
