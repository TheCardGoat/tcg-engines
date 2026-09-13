import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/spellbane-sigil.generated.ts";

export const spellbaneSigil = definePitchFamily(fabPitchFamilies["spellbane-sigil"], {
  keywords: [
    {
      name: "arcane-barrier",
      value: {
        type: "x",
      },
    },
  ],
  abilities: () => ({
    atBeginningActionPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: spellbaneSigilBlue } = spellbaneSigil.cards;
