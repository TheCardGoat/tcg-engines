import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cryptic-crossing.generated.ts";

export const crypticCrossing = definePitchFamily(fabPitchFamilies["cryptic-crossing"], {
  abilities: () => ({
    ifAttackActionNonAttackActionWerePitchedPlay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "pitched-attack-and-non-attack-action-to-play-this",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "firstTimeDealsDamageDefendingHeroTheyDiscardDraw",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "dealt-damage",
                  actor: {
                    kind: "any",
                  },
                  observes: {
                    kind: "source",
                    selector: "damage-source",
                  },
                  target: {
                    kind: "hero",
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "discard",
                      target: {
                        selector: "attack-target",
                      },
                    },
                    {
                      type: "draw",
                      count: 1,
                      player: "controller",
                    },
                  ],
                },
              },
              limit: {
                count: 1,
                per: "turn",
                ordinals: [1],
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});
export const { yellow: crypticCrossingYellow } = crypticCrossing.cards;
