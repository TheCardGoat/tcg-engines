import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reek-of-corruption.generated.ts";

export const reekOfCorruption = definePitchFamily(fabPitchFamilies["reek-of-corruption"], {
  abilities: () => ({
    performedThisTurnPlayOrCreateAuraGrantPropertyTriggeredHitDiscardThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredHitDiscard",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "discard",
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: reekOfCorruptionRed,
  yellow: reekOfCorruptionYellow,
  blue: reekOfCorruptionBlue,
} = reekOfCorruption.cards;
