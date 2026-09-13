import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/dam-the-shadowake.generated.ts";

export const damTheShadowake = definePitchFamily(fabPitchFamilies["dam-the-shadowake"], {
  abilities: () => ({
    whenDefendsShadowHeroAttackCreateGate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
        state: {
          type: "control-object",
          player: "attacking-hero",
          zones: ["hero"],
          filter: { typeBox: { supertypes: ["Shadow"] } },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gate-to-i-arathael",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: damTheShadowakeRed,
  yellow: damTheShadowakeYellow,
  blue: damTheShadowakeBlue,
} = damTheShadowake.cards;
