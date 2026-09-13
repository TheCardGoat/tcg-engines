import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const peerIntoMana: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "914hZjxDL0",
  slug: "peer-into-mana",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "914hZjxDL0:face:default",
      catalogId: "914hZjxDL0",
      name: "Peer into Mana",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put 2+LV enlighten counters on your champion. (LV refers to your champion's level. You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "914hZjxDL0-a1",
          kind: "card-resolution",
          text: "Put 2+LV enlighten counters on your champion. (LV refers to your champion's level. You may remove three enlighten counters from your champion to draw a card.)",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                2,
                {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default peerIntoMana;
