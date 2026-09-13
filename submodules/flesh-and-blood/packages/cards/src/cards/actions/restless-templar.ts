import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-templar.generated.ts";
import { decay } from "../shared/keywords.ts";

export const restlessTemplar = definePitchFamily(fabPitchFamilies["restless-templar"], {
  keywords: [decay],
  abilities: () => ({
    zombieWithDecayDiesCreatesGate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dies",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: { kind: "controller", player: "ability-controller" },
            filter: { typeBox: { subtypes: ["Zombie"] }, hasKeyword: "decay" },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "gate-to-i-arathael", controller: "controller" },
      },
    },
  }),
});

export const { red: restlessTemplarRed } = restlessTemplar.cards;
