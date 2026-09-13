import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spectralBeacon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yxk7e8opr6",
  slug: "spectral-beacon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yxk7e8opr6:face:default",
      catalogId: "yxk7e8opr6",
      name: "Spectral Beacon",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "(1), Banish Spectral Beacon: Banish target card in a graveyard.",
      abilities: [
        {
          id: "yxk7e8opr6-a1",
          kind: "activated",
          text: "(1), Banish Spectral Beacon: Banish target card in a graveyard.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "banish-object",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
          },
        },
      ],
    },
  },
};

export default spectralBeacon;
