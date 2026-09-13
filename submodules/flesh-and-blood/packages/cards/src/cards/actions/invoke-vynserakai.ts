import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-vynserakai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { vynserakai } from "../allies/vynserakai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeVynserakaiIdentity = fabPitchFamilies["invoke-vynserakai"].variants.red;
const vynserakaiIdentity = fabCardIdentitiesByCanonicalId["MFrJG8G8RgrhkpfkD8KWj"];
const invokeVynserakaiAbilities = expandSemanticAbilities(invokeVynserakaiIdentity.canonicalId, {
  transformAshIntoVynserakai: {
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

export const invokeVynserakai = definePitchFamily(fabPitchFamilies["invoke-vynserakai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeVynserakaiIdentity, {
        name: "Invoke Vynserakai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeVynserakaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 3, defense: 3 },
      }),
      back: defineLayoutFace(vynserakaiIdentity, {
        name: "Vynserakai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(vynserakai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: vynserakai.base.abilities,
        numeric: { power: 6 },
      }),
    }),
  },
});

export const { red: invokeVynserakaiRed } = invokeVynserakai.cards;
