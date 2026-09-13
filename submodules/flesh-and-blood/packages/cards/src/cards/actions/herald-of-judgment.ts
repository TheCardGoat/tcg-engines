import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-judgment.generated.ts";

export const heraldOfJudgment = definePitchFamily(fabPitchFamilies["herald-of-judgment"], {
  keywords: [
    {
      name: "specialization",
      hero: "Prism",
    },
    phantasm,
  ],
  abilities: () => ({
    hitsPutHerosSoulDefendingCantPlayBanishedZoneDuringNextActionPhase: {
      kind: "static",
      staticKind: "triggered",
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "soul",
              },
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                playedFromZones: ["banished"],
              },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: heraldOfJudgmentYellow } = heraldOfJudgment.cards;
