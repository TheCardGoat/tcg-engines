import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/last-ditch-effort.generated.ts";

/**
 * Model notes (hand-authored):
 * - +4{p} and go again are granted only when the deck is empty — not printed keywords.
 */
export const lastDitchEffort = definePitchFamily(fabPitchFamilies["last-ditch-effort"], {
  abilities: () => ({
    playLastDitchEffortNoDeckGains4PowerGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Last Ditch Effort",
            },
          },
        },
        state: {
          type: "zone-count",
          zone: "deck",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 4,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: lastDitchEffortBlue } = lastDitchEffort.cards;
