import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ominous-respite.generated.ts";

export const ominousRespite = definePitchFamily(fabPitchFamilies["ominous-respite"], {
  abilities: () => ({
    gain2IfAuraControlWasDestroyedTurnInstead: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-life",
            amount: 2,
            target: {
              selector: "controller",
            },
          },
          {
            type: "self-replacement",
            condition: { type: "performed-this-turn", event: "destroy-aura", player: "controller" },
            modification: {
              type: "gain-life",
              amount: 3,
              target: {
                selector: "controller",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: ominousRespiteYellow } = ominousRespite.cards;
