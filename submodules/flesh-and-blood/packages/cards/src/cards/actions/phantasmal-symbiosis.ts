import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phantasmal-symbiosis.generated.ts";

export const phantasmalSymbiosis = definePitchFamily(fabPitchFamilies["phantasmal-symbiosis"], {
  keywords: [phantasm],
  abilities: () => ({
    attacksNameNameIllusionistEndTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["combat-chain", "visible-cards"],
            },
            {
              type: "grant-property",
              property: {
                kind: "supertype",
                value: "Illusionist",
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["hero", "permanent", "combat-chain", "stack"],
                filter: {
                  name: "chosen",
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: phantasmalSymbiosisYellow } = phantasmalSymbiosis.cards;
