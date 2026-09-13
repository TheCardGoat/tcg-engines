import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-miragai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { miragai } from "../allies/miragai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeMiragaiIdentity = fabPitchFamilies["invoke-miragai"].variants.red;
const miragaiIdentity = fabCardIdentitiesByCanonicalId["Nhdt8dQ86kQhLgFd8cd8z"];
const invokeMiragaiAbilities = expandSemanticAbilities(invokeMiragaiIdentity.canonicalId, {
  transformAshIntoMiragai: {
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

export const invokeMiragai = definePitchFamily(fabPitchFamilies["invoke-miragai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeMiragaiIdentity, {
        name: "Invoke Miragai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeMiragaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 1, defense: 3 },
      }),
      back: defineLayoutFace(miragaiIdentity, {
        name: "Miragai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(miragai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: miragai.base.abilities,
        numeric: { power: 2 },
      }),
    }),
  },
});

export const { red: invokeMiragaiRed } = invokeMiragai.cards;
