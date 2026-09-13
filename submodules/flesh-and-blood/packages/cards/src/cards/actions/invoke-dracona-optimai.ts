import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-dracona-optimai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { draconaOptimai } from "../allies/dracona-optimai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeDraconaOptimaiIdentity = fabPitchFamilies["invoke-dracona-optimai"].variants.red;
const draconaOptimaiIdentity = fabCardIdentitiesByCanonicalId["78FGMN9nn9QR9FDzC9z68"];
const invokeDraconaOptimaiAbilities = expandSemanticAbilities(
  invokeDraconaOptimaiIdentity.canonicalId,
  {
    transformAshIntoDraconaOptimai: {
      kind: "resolution",
      layerKeywords: [goAgain],
      effect: {
        type: "transform-into-resolving-card",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: { name: "Ash" },
          count: 1,
        },
      },
      label: { name: "transform" },
    },
  },
);

export const invokeDraconaOptimai = definePitchFamily(fabPitchFamilies["invoke-dracona-optimai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeDraconaOptimaiIdentity, {
        name: "Invoke Dracona Optimai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeDraconaOptimaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 6, defense: 3 },
      }),
      back: defineLayoutFace(draconaOptimaiIdentity, {
        name: "Dracona Optimai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(draconaOptimai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: draconaOptimai.base.abilities,
        numeric: { power: 6 },
      }),
    }),
  },
});

export const { red: invokeDraconaOptimaiRed } = invokeDraconaOptimai.cards;
