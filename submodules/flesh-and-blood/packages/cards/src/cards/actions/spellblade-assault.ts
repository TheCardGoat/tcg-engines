import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spellblade-assault.generated.ts";

export const spellbladeAssault = definePitchFamily(fabPitchFamilies["spellblade-assault"], {
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Spellblade Assault",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count: 2,
        },
      },
    },
  }),
});

export const {
  red: spellbladeAssaultRed,
  yellow: spellbladeAssaultYellow,
  blue: spellbladeAssaultBlue,
} = spellbladeAssault.cards;
