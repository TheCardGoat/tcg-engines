import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-cromai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { cromai } from "../allies/cromai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeCromaiIdentity = fabPitchFamilies["invoke-cromai"].variants.red;
const cromaiIdentity = fabCardIdentitiesByCanonicalId["hnnpkTnnFPR76kw7qg7mr"];
const invokeCromaiAbilities = expandSemanticAbilities(invokeCromaiIdentity.canonicalId, {
  transformAshIntoCromai: {
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
});

export const invokeCromai = definePitchFamily(fabPitchFamilies["invoke-cromai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeCromaiIdentity, {
        name: "Invoke Cromai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeCromaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 0, defense: 3 },
      }),
      back: defineLayoutFace(cromaiIdentity, {
        name: "Cromai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(cromai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: cromai.base.abilities,
        numeric: { power: 3 },
      }),
    }),
  },
});

export const { red: invokeCromaiRed } = invokeCromai.cards;
