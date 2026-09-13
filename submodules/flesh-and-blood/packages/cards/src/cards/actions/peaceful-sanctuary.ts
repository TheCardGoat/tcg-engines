import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/peaceful-sanctuary.generated.ts";

export const peacefulSanctuary = definePitchFamily(fabPitchFamilies["peaceful-sanctuary"], {
  abilities: () => ({
    noAuraTokens: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "create",
        filter: { typeBox: { metatypes: ["Token"], subtypes: ["Aura"] } },
        duration: "while-in-arena",
      },
    },
    expire: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: { kind: "effect", effect: { type: "destroy", target: { selector: "self" } } },
    },
  }),
});
export const { red: peacefulSanctuaryRed } = peacefulSanctuary.cards;
