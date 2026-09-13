import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dummyTrainer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QCUld5Xidm",
  slug: "dummy-trainer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QCUld5Xidm:face:default",
      catalogId: "QCUld5Xidm",
      name: "Dummy Trainer",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "DEVICE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(3), Banish Dummy Trainer: Draw a card into your memory. Then target opponent summons a Training Dummy token. ",
      abilities: [
        {
          id: "QCUld5Xidm-a1",
          kind: "activated",
          text: "(3), Banish Dummy Trainer: Draw a card into your memory. Then target opponent summons a Training Dummy token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "summon",
                object: "Training Dummy",
                controller: {
                  binding: "target-opponent",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dummyTrainer;
