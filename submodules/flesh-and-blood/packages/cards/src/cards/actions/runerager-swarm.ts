import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runerager-swarm.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const runeragerSwarm = definePitchFamily(fabPitchFamilies["runerager-swarm"], {
  abilities: () => ({
    performedThisTurnPlayOrCreateAuraGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
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
  red: runeragerSwarmRed,
  yellow: runeragerSwarmYellow,
  blue: runeragerSwarmBlue,
} = runeragerSwarm.cards;
