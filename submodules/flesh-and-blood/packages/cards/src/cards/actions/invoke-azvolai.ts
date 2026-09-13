import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-azvolai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { azvolai } from "../allies/azvolai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeAzvolaiIdentity = fabPitchFamilies["invoke-azvolai"].variants.red;
const azvolaiIdentity = fabCardIdentitiesByCanonicalId["wBNMRCQPNBjPcfJwgrf9j"];
const invokeAzvolaiAbilities = expandSemanticAbilities(invokeAzvolaiIdentity.canonicalId, {
  transformAshIntoAzvolai: {
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

export const invokeAzvolai = definePitchFamily(fabPitchFamilies["invoke-azvolai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeAzvolaiIdentity, {
        name: "Invoke Azvolai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeAzvolaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 0, defense: 3 },
      }),
      back: defineLayoutFace(azvolaiIdentity, {
        name: "Azvolai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(azvolai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: azvolai.base.abilities,
        numeric: { power: 2 },
      }),
    }),
  },
});

export const { red: invokeAzvolaiRed } = invokeAzvolai.cards;
