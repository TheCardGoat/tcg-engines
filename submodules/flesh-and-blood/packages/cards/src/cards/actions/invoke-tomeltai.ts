import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-tomeltai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { tomeltai } from "../allies/tomeltai.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeTomeltaiIdentity = fabPitchFamilies["invoke-tomeltai"].variants.red;
const tomeltaiIdentity = fabCardIdentitiesByCanonicalId["JQqp6Ctw7QMLRDMgTnW6g"];
const invokeTomeltaiAbilities = expandSemanticAbilities(invokeTomeltaiIdentity.canonicalId, {
  transformAshIntoTomeltai: {
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

export const invokeTomeltai = definePitchFamily(fabPitchFamilies["invoke-tomeltai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeTomeltaiIdentity, {
        name: "Invoke Tomeltai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeTomeltaiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 5, defense: 3 },
      }),
      back: defineLayoutFace(tomeltaiIdentity, {
        name: "Tomeltai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(tomeltai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: tomeltai.base.abilities,
        numeric: { power: 5 },
      }),
    }),
  },
});

export const { red: invokeTomeltaiRed } = invokeTomeltai.cards;
