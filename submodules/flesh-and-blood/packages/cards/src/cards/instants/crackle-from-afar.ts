import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/crackle-from-afar.generated.ts";

export const crackleFromAfar = definePitchFamily(fabPitchFamilies["crackle-from-afar"], {
  keywords: [ward(1)],
  abilities: () => ({
    whenEntersArenaUp1TargetAttackGets1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: { type: "up-to", amount: 1 },
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  }),
});

export const { blue: crackleFromAfarBlue } = crackleFromAfar.cards;
