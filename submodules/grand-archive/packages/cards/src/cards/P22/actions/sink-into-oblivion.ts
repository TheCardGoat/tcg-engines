import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinkIntoOblivion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a8I89SP24E",
  slug: "sink-into-oblivion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a8I89SP24E:face:default",
      catalogId: "a8I89SP24E",
      name: "Sink into Oblivion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText: "Target player puts the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "a8I89SP24E-a1",
          kind: "card-resolution",
          text: "Target player puts the top three cards of their deck into their graveyard.",
          targets: [
            {
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default sinkIntoOblivion;
