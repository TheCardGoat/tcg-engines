import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blizzard.generated.ts";

export const blizzard = definePitchFamily(fabPitchFamilies["blizzard"], {
  abilities: () => ({
    targetAttackLosesCanTGainGoAgainUnless: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "remove-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "object",
                declared: "on-stack",
                // Combat chain is shared; "target attack" is not "your attack".
                player: "any",
                zones: ["combat-chain"],
                filter: attackActionFilter(),
                count: 1,
              },
              duration: "this-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "gain-keyword",
              filter: {
                hasKeyword: "go-again",
              },
              duration: "this-turn",
            },
          ],
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          // Attack controller is the attacking hero for that link (CR 8.2.8c allies).
          // `target-controller` is not yet offered by unlessEscapeIsAvailable.
          payer: "attacking-hero",
        },
      },
    },
  }),
});

export const { blue: blizzardBlue } = blizzard.cards;
