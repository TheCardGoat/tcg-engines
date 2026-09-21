import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/core-reaction.generated.ts";

export const coreReaction = definePitchFamily(fabPitchFamilies["core-reaction"], {
  parameters: pitchMap({
    red: { amount: 4 },
    yellow: { amount: 3 },
    blue: { amount: 2 },
  }),
  abilities: ({ amount }) => ({
    discharge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "destroy", target: { selector: "self" } },
            {
              type: "deal-damage",
              damageType: "arcane",
              amount,
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["hero", "permanent"],
                filter: { hasProperty: "life" },
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: coreReactionRed,
  yellow: coreReactionYellow,
  blue: coreReactionBlue,
} = coreReaction.cards;
