import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/scar-tissue.generated.ts";

export const scarTissue = definePitchFamily(fabPitchFamilies["scar-tissue"], {
  supertypeSets: [["Assassin"], ["Warrior"]],
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount, context) => ({
    daggerMark: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Dagger"] } },
            count: 1,
          },
          duration: "this-turn",
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: `${context.canonicalId}:daggerMark:onHit`,
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "hit",
                  actor: { kind: "player", player: "ability-controller" },
                  observes: { kind: "source", selector: "attack" },
                  target: { kind: "hero" },
                },
              },
              resolution: {
                kind: "effect",
                effect: { type: "mark", target: { selector: "attack-target" } },
              },
            },
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Dagger"] } },
            count: 1,
          },
          duration: "this-turn",
        },
      ],
      outputBinding: "it",
    },
  }),
});
export const {
  red: scarTissueRed,
  yellow: scarTissueYellow,
  blue: scarTissueBlue,
} = scarTissue.cards;
