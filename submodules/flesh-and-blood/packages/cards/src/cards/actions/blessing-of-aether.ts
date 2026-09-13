import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-aether.generated.ts";

export const blessingOfAether = definePitchFamily(fabPitchFamilies["blessing-of-aether"], {
  abilities: (_parameter, { pitch }) => ({
    staticTriggeredStartPhaseStartPhaseSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "replacement",
              replacementKind: "standard",
              replaces: {
                name: "damage",
                damageType: "arcane",
              },
              modification: {
                type: "modify-numeric",
                property: "count",
                op: "add",
                amount: 4 - Number(pitch),
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  hasStatus: "arcane-damage-effect",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfAetherRed,
  yellow: blessingOfAetherYellow,
  blue: blessingOfAetherBlue,
} = blessingOfAether.cards;
