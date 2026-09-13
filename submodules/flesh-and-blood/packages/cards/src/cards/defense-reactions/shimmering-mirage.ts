import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/shimmering-mirage.generated.ts";
import { mirage } from "../shared/keywords.ts";

export const shimmeringMirage = definePitchFamily(fabPitchFamilies["shimmering-mirage"], {
  keywords: [mirage],
  abilities: () => ({
    banishAndReplayAfterChainLink: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "chain-link-resolve",
          actor: {
            kind: "any",
          },
          // Mirage is defending, not the attack itself; scope the link
          // resolution through the "defending" state condition instead.
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "defending",
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
                selector: "self",
              },
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-combat-chain",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: shimmeringMirageBlue } = shimmeringMirage.cards;
