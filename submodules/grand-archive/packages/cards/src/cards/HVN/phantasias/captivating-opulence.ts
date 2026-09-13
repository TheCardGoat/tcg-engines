import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const captivatingOpulence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tnl3qr42vp",
  slug: "captivating-opulence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tnl3qr42vp:face:default",
      catalogId: "tnl3qr42vp",
      name: "Captivating Opulence",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Diao Chan Bonus] Activated abilities of regalias you don't control cost (2) more to activate. ",
      abilities: [
        {
          id: "tnl3qr42vp-a1",
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
          id: "tnl3qr42vp-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] Activated abilities of regalias you don't control cost (2) more to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              activationKind: "ability",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              filter: {
                kind: "supertype",
                oneOf: ["REGALIA"],
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default captivatingOpulence;
