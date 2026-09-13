import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cleansingReunion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xpnjvt9y59",
  slug: "cleansing-reunion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xpnjvt9y59:face:default",
      catalogId: "xpnjvt9y59",
      name: "Cleansing Reunion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nTarget player banishes three cards from their graveyard. If Cleansing Reunion is imbued, that player banishes six cards from their graveyard instead.",
      abilities: [
        {
          id: "xpnjvt9y59-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "xpnjvt9y59-a2",
          kind: "card-resolution",
          text: "Target player banishes three cards from their graveyard. If Cleansing Reunion is imbued, that player banishes six cards from their graveyard instead.",
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
            kind: "banish",
            player: {
              binding: "target-player",
            },
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              count: {
                kind: "exactly",
                amount: {
                  kind: "conditional",
                  condition: {
                    kind: "activation-state",
                    state: "imbued",
                  },
                  then: 6,
                  else: 3,
                },
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: {
                  binding: "target-player",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default cleansingReunion;
