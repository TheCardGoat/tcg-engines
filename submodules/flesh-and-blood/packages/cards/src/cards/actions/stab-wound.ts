import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stab-wound.generated.ts";

export const stabWound = definePitchFamily(fabPitchFamilies["stab-wound"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  abilities: () => ({
    whenHitsHeroTheyLoseXLifeWhereXNumberTimesDagger: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: {
            type: "count",
            what: "attacks-hit-this-combat-chain",
            // The count fact narrows daggers strictly by their Attack
            // subtype (see count.ts's dagger-only gate).
            filter: {
              typeBox: {
                subtypes: ["Dagger"],
              },
            },
          },
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { blue: stabWoundBlue } = stabWound.cards;
