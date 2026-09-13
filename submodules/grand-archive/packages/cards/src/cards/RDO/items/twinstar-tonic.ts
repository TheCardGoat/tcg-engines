import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const twinstarTonic: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yBDxSHkT1s",
  slug: "twinstar-tonic",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yBDxSHkT1s:face:default",
      catalogId: "yBDxSHkT1s",
      name: "Twinstar Tonic",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Arisanna Bonus] Brew — Two Blightroot, Two Silvershine, Two Razorvine\n\nSacrifice Twinstar Tonic: For the rest of the game, whenever you starcall a card, you may copy that activation. If you do, you may choose new targets for that copy. ",
      abilities: [
        {
          id: "yBDxSHkT1s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Arisanna Bonus] Brew — Two Blightroot, Two Silvershine, Two Razorvine",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Blightroot",
                count: 2,
              },
              {
                kind: "name",
                value: "Silvershine",
                count: 2,
              },
              {
                kind: "name",
                value: "Razorvine",
                count: 2,
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
        },
        {
          id: "yBDxSHkT1s-a2",
          kind: "activated",
          text: "Sacrifice Twinstar Tonic: For the rest of the game, whenever you starcall a card, you may copy that activation. If you do, you may choose new targets for that copy.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "card-activated",
                actor: "controller",
                activationState: "starcalled",
                isCopy: false,
              },
            },
            expires: {
              kind: "permanent",
            },
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "copy",
                subject: {
                  kind: "event-subject",
                },
                copy: "card-activation",
                amount: 1,
                mayChooseNewTargets: true,
              },
            },
          },
        },
      ],
    },
  },
};

export default twinstarTonic;
