import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smash-with-big-rock.generated.ts";

export const smashWithBigRock = definePitchFamily(fabPitchFamilies["smash-with-big-rock"], {
  abilities: () => ({
    defendingCanTGainDefense: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-defense",
        filter: {
          defending: true,
        },
        duration: "this-combat-chain",
      },
    },
  }),
});

export const { yellow: smashWithBigRockYellow } = smashWithBigRock.cards;
