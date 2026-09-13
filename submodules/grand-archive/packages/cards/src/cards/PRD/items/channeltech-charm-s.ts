import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const channeltechCharmS: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rR2j9dQRDH",
  slug: "channeltech-charm-s",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rR2j9dQRDH:face:default",
      catalogId: "rR2j9dQRDH",
      name: "ChannelTech Charm S",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "VELTECH", "DEVICE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Class Bonus] Sacrifice ChannelTech Charm S: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level. Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "rR2j9dQRDH-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "rR2j9dQRDH-a2",
          kind: "activated",
          text: "[Class Bonus] Sacrifice ChannelTech Charm S: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level. Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
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
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default channeltechCharmS;
