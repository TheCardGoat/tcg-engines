import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/springboard-somersault.generated.ts";

export const springboardSomersault = definePitchFamily(fabPitchFamilies["springboard-somersault"], {
  abilities: () => ({
    gainDefenseFromArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const { yellow: springboardSomersaultYellow } = springboardSomersault.cards;
