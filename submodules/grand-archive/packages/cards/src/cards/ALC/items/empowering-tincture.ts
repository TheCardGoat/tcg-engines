import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const empoweringTincture: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9g44vm5kt3",
  slug: "empowering-tincture",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9g44vm5kt3:face:default",
      catalogId: "9g44vm5kt3",
      name: "Empowering Tincture",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — One Manaroot, One Herb\n\nOn Enter: If Empowering Tincture was brewed, draw a card into your memory.\n\nSacrifice Empowering Tincture: Your champion gets +2 level until end of turn.",
      abilities: [
        {
          id: "9g44vm5kt3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Manaroot, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Manaroot",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "9g44vm5kt3-a2",
          kind: "triggered",
          text: "On Enter: If Empowering Tincture was brewed, draw a card into your memory.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "brewed",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
        {
          id: "9g44vm5kt3-a3",
          kind: "activated",
          text: "Sacrifice Empowering Tincture: Your champion gets +2 level until end of turn.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default empoweringTincture;
