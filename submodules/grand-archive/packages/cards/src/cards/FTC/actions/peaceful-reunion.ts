import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const peacefulReunion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wr42i6eifn",
  slug: "peaceful-reunion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wr42i6eifn:face:default",
      catalogId: "wr42i6eifn",
      name: "Peaceful Reunion",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Activate this card only if you have not declared an attack this turn.\nUntil the beginning of your next turn, you and target player can't declare attacks. Banish Peaceful Reunion.",
      abilities: [
        {
          id: "wr42i6eifn-a1",
          kind: "card-resolution",
          text: "Activate this card only if you have not declared an attack this turn.\nUntil the beginning of your next turn, you and target player can't declare attacks. Banish Peaceful Reunion.",
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
          restrictions: [
            {
              kind: "static",
              condition: {
                kind: "not",
                condition: {
                  kind: "history",
                  event: "attack-declared",
                  window: "this-turn",
                  actor: "controller",
                  minimum: 1,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "attack",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "attack",
                subject: {
                  kind: "player",
                  player: {
                    binding: "target-player",
                  },
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default peacefulReunion;
