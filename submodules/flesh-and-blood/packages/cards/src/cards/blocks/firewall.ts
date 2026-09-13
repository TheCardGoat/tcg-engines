import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/firewall.generated.ts";

export const firewall = definePitchFamily(fabPitchFamilies["firewall"], {
  parameters: pitchMap({ red: { value1: 1 }, yellow: { value1: 1 }, blue: { value1: 1 } }),
  abilities: ({ value1 }) => ({
    revealEvoToPreventDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: value1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    subtypes: ["Evo"],
                  },
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "deck",
                  position: "top",
                },
              },
              else: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: firewallRed, yellow: firewallYellow, blue: firewallBlue } = firewall.cards;
