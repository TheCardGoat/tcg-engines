import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/asking-for-trouble.generated.ts";

export const askingForTrouble = definePitchFamily(fabPitchFamilies["asking-for-trouble"], {
  abilities: () => ({
    createVigor: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "vigor", controller: "opponent" },
      },
    },
  }),
});

export const { yellow: askingForTroubleYellow } = askingForTrouble.cards;
