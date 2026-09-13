import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-dominia.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { dominia } from "../allies/dominia.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeDominiaIdentity = fabPitchFamilies["invoke-dominia"].variants.red;
const dominiaIdentity = fabCardIdentitiesByCanonicalId["hjggcdqWwpwNKCrTBj6J7"];
const invokeDominiaAbilities = expandSemanticAbilities(invokeDominiaIdentity.canonicalId, {
  transformAshIntoDominia: {
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

export const invokeDominia = definePitchFamily(fabPitchFamilies["invoke-dominia"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeDominiaIdentity, {
        name: "Invoke Dominia",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeDominiaAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 4, defense: 3 },
      }),
      back: defineLayoutFace(dominiaIdentity, {
        name: "Dominia",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(dominia.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: dominia.base.abilities,
        numeric: { power: 4 },
      }),
    }),
  },
});

export const { red: invokeDominiaRed } = invokeDominia.cards;
