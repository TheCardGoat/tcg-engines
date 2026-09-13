import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/violent-gusto.generated.ts";

export const violentGusto = definePitchFamily(fabPitchFamilies["violent-gusto"], {
  abilities: () => ({
    nameAuraOnAttackAndReturnMatchingAurasOnHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["permanent"],
                  filter: { typeBox: { subtypes: ["Aura"] } },
                  count: 1,
                },
                outputBinding: "named-aura",
              },
              {
                type: "move-card",
                target: { selector: "binding", binding: "named-aura" },
                to: { zone: "hand", player: "owner" },
              },
              {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                    target: { kind: "hero" },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-chain-link",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "move-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "attack-target",
                      zones: ["permanent"],
                      filter: { sameNameAs: { binding: "named-aura" } },
                      count: { type: "all" },
                    },
                    to: { zone: "hand", player: "owner" },
                  },
                },
              },
            ],
          },
        },
      },
    },
  }),
});
export const { red: violentGustoRed } = violentGusto.cards;
