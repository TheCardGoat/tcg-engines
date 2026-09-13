import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistboundWatcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mA4n0Z7BQz",
  slug: "mistbound-watcher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mA4n0Z7BQz:face:default",
      catalogId: "mA4n0Z7BQz",
      name: "Mistbound Watcher",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPIRIT"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "[Class Bonus] At the beginning of your end phase, put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "mA4n0Z7BQz-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card. Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default mistboundWatcher;
