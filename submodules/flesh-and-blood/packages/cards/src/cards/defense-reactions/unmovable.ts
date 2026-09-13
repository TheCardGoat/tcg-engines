import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/unmovable.generated.ts";

export const unmovable = definePitchFamily(fabPitchFamilies.unmovable, {
  abilities: () => ({
    arsenalDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "played-card" },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: { selector: "self" },
          duration: "permanent",
        },
      },
    },
  }),
});

export const { red: unmovableRed, yellow: unmovableYellow, blue: unmovableBlue } = unmovable.cards;
