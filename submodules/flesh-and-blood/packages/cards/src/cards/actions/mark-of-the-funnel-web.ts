import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mark-of-the-funnel-web.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  triggeredHitBanish: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "attack",
          relationship: {
            kind: "any",
          },
          filter: {
            hasStatus: "marked",
          },
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["arsenal"],
          count: 1,
        },
      },
    },
  },
} as const;

export const markOfTheFunnelWeb = definePitchFamily(fabPitchFamilies["mark-of-the-funnel-web"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: markOfTheFunnelWebRed,
  yellow: markOfTheFunnelWebYellow,
  blue: markOfTheFunnelWebBlue,
} = markOfTheFunnelWeb.cards;
