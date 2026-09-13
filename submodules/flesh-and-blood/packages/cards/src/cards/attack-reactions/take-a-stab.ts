import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/take-a-stab.generated.ts";

export const takeAStab = definePitchFamily(fabPitchFamilies["take-a-stab"], {
  supertypeSets: [["Assassin"], ["Warrior"]],
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount, context) => ({
    daggerReflex: {
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
          outputBinding: "it",
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: `${context.canonicalId}:daggerReflex:onHit`,
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "hit",
                  actor: { kind: "any" },
                  observes: {
                    kind: "event-object",
                    selector: "attack",
                    relationship: { kind: "any" },
                    filter: { hasStatus: "marked" },
                  },
                  target: { kind: "hero" },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "optional",
                  effect: {
                    type: "modify-activation-limit",
                    target: { selector: "self" },
                    operation: "additional",
                    count: 1,
                    duration: "this-turn",
                  },
                },
              },
            },
          },
          target: { selector: "binding", binding: "it" },
          duration: "this-turn",
        },
      ],
      outputBinding: "it",
    },
  }),
});
export const { red: takeAStabRed, yellow: takeAStabYellow, blue: takeAStabBlue } = takeAStab.cards;
