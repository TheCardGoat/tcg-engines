import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ominous-aggression.generated.ts";

export const ominousAggression = definePitchFamily(fabPitchFamilies["ominous-aggression"], {
  abilities: () => ({
    targetAttackActionGets2IfAuraControlWas: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: attackActionFilter(),
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "self-replacement",
            condition: { type: "performed-this-turn", event: "destroy-aura", player: "controller" },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 4,
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["combat-chain"],
                filter: attackActionFilter(),
                count: 1,
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { red: ominousAggressionRed } = ominousAggression.cards;
