import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/public-bounty.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const publicBounty = definePitchFamily(fabPitchFamilies["public-bounty"], {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    markHero: {
      kind: "resolution",
      effect: { type: "mark", target: { selector: "opponent" } },
    },
    rewardMarkedAttack: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: { kind: "player", player: "ability-controller" },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: { kind: "any" },
              filter: { hasStatus: "marked" },
            },
            target: { kind: "hero" },
          },
        },
        policy: { kind: "windowed", duration: "this-turn", matching: "first" },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: powerBonus,
            target: { selector: "this-attack" },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: publicBountyRed,
  yellow: publicBountyYellow,
  blue: publicBountyBlue,
} = publicBounty.cards;
