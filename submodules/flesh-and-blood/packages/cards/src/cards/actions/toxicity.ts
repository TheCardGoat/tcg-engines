import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/toxicity.generated.ts";

export const toxicity = definePitchFamily(fabPitchFamilies["toxicity"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  parameters: pitchMap({ red: { value1: 5 }, yellow: { value1: 4 }, blue: { value1: 3 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionGrantProperty: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredStaticOnHitEffect",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "lose-life",
                amount: value1,
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          or: [
            {
              typeBox: {
                supertypes: ["Assassin"],
              },
            },
            {
              typeBox: {
                supertypes: ["Ranger"],
              },
            },
          ],
        }),
      },
    },
  }),
});

export const { red: toxicityRed, yellow: toxicityYellow, blue: toxicityBlue } = toxicity.cards;
