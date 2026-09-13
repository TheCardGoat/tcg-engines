import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/feign-death.generated.ts";

export const feignDeath = definePitchFamily(fabPitchFamilies["feign-death"], {
  abilities: () => ({
    playFeignDeathOnlyIfHeroHasBeenDealt: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "be-dealt-damage", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
    nextTimeHeroWouldBeDealtDamageTurnPrevent: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: {
          type: "event-amount",
        },
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: feignDeathYellow } = feignDeath.cards;
