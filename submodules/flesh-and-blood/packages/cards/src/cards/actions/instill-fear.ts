import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/instill-fear.generated.ts";

export const instillFear = definePitchFamily(fabPitchFamilies["instill-fear"], {
  abilities: () => ({
    triggeredAttackIntimidate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "intimidate",
          target: "attack-target",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});
export const {
  red: instillFearRed,
  yellow: instillFearYellow,
  blue: instillFearBlue,
} = instillFear.cards;
