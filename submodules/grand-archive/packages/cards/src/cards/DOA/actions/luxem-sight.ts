import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luxemSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uwnHTLG3fL",
  slug: "luxem-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uwnHTLG3fL:face:default",
      catalogId: "uwnHTLG3fL",
      name: "Luxem Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Element Bonus] Whenever you reveal this card from your memory, recover 3. (To recover, remove that many damage counters from your champion. Apply this effect only if your champion's element matches this card's element.)\n\nDraw a card.",
      abilities: [
        {
          id: "uwnHTLG3fL-a1",
          kind: "triggered",
          text: "[Element Bonus] Whenever you reveal this card from your memory, recover 3. (To recover, remove that many damage counters from your champion. Apply this effect only if your champion's element matches this card's element.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
          functionalZones: ["memory"],
        },
        {
          id: "uwnHTLG3fL-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default luxemSight;
