import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/withstand.generated.ts";

export const withstand = definePitchFamily(fabPitchFamilies["withstand"], {
  parameters: pitchMap({
    red: 6,
    yellow: 5,
    blue: 4,
  }),
  abilities: (amount) => ({
    empowerGuardianOffHand: {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: { kind: "any" },
            filter: {
              typeBox: {
                supertypes: ["Guardian"],
                subtypes: ["Off-Hand"],
              },
            },
            bindAs: "it",
          },
        },
      },
      policy: {
        kind: "windowed",
        duration: "this-turn",
        matching: "first",
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount,
          target: {
            selector: "binding",
            binding: "it",
          },
          duration: "this-combat-chain",
        },
      },
    },
  }),
});

export const { red: withstandRed, yellow: withstandYellow, blue: withstandBlue } = withstand.cards;
