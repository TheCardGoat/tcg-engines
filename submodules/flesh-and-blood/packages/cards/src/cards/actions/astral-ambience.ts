import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/astral-ambience.generated.ts";
import { goAgain, fragment } from "../shared/keywords.ts";

export const astralAmbience = definePitchFamily(fabPitchFamilies["astral-ambience"], {
  keywords: [fragment],
  abilities: () => ({
    fragment: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "fragment",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "spectral-shield", controller: "controller" },
      },
    },
    goAgain: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "tap", filter: { name: "Spectral Shield" }, count: 1 },
      effect: {
        type: "grant-property",
        property: { kind: "keyword", keyword: goAgain },
        target: { selector: "self" },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: astralAmbienceYellow } = astralAmbience.cards;
