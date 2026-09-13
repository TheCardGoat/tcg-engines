import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-frozen-thoughts.generated.ts";

export const crownOfFrozenThoughts = defineCard(
  fabCardIdentitiesByCanonicalId["8cCPkCrpTtbtL7hw7F8jG"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsFreezeAttackingHeroUntilStartTheirNext: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "freeze",
            target: {
              selector: "attacking-hero",
            },
            duration: "until-end-of-next-turn",
          },
        },
        label: {
          name: "freeze",
        },
      },
    },
  },
);
