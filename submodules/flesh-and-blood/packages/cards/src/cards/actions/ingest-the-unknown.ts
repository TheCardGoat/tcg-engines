import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ingest-the-unknown.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const ingestTheUnknown = definePitchFamily(fabPitchFamilies["ingest-the-unknown"], {
  keywords: [bloodDebt],
  abilities: () => ({
    attack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: { type: "reference", binding: "it", property: "power", missing: "zero" },
              target: { selector: "self" },
              duration: "this-chain-link",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: ingestTheUnknownYellow } = ingestTheUnknown.cards;
