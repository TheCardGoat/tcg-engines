import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pack-hunt.generated.ts";

export const packHunt = definePitchFamily(fabPitchFamilies["pack-hunt"], {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "opponent",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: packHuntRed, yellow: packHuntYellow, blue: packHuntBlue } = packHunt.cards;
