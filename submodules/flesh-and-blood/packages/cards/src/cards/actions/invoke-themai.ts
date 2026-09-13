import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-themai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { themai } from "../allies/themai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeThemaiIdentity = fabPitchFamilies["invoke-themai"].variants.red;
const themaiIdentity = fabCardIdentitiesByCanonicalId["HBMfgJPgbmbWzJrRtJCjk"];
const invokeThemaiAbilities = expandSemanticAbilities(invokeThemaiIdentity.canonicalId, {
  transformAshIntoThemai: {
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

export const invokeThemai = definePitchFamily(fabPitchFamilies["invoke-themai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeThemaiIdentity, {
        name: "Invoke Themai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeThemaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 2, defense: 3 },
      }),
      back: defineLayoutFace(themaiIdentity, {
        name: "Themai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(themai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: themai.base.abilities,
        numeric: { power: 3 },
      }),
    }),
  },
});

export const { red: invokeThemaiRed } = invokeThemai.cards;
