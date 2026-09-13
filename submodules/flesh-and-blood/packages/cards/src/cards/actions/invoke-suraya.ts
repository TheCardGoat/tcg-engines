import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-suraya.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { surayaArchangelOfKnowledge } from "../allies/suraya-archangel-of-knowledge.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeSurayaIdentity = fabPitchFamilies["invoke-suraya"].variants.yellow;
const surayaIdentity = fabCardIdentitiesByCanonicalId["7GqwMzK8mCrkKQ9kdpF7W"];
const invokeSurayaAbilities = expandSemanticAbilities(invokeSurayaIdentity.canonicalId, {
  transformAshIntoSuraya: {
    kind: "resolution",
    layerKeywords: [goAgain],
    effect: {
      type: "transform-into-resolving-card",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["permanent"],
        filter: { name: "Spectral Shield" },
        count: 1,
      },
    },
    label: { name: "transform" },
  },
});

export const invokeSuraya = definePitchFamily(fabPitchFamilies["invoke-suraya"], {
  layouts: {
    yellow: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeSurayaIdentity, {
        name: "Invoke Suraya",
        typeText: "Mystic Illusionist Action - Invocation",
        types: ["Light", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeSurayaAbilities,
        color: "yellow",
        numeric: { pitch: 2, cost: 2, defense: 3 },
      }),
      back: defineLayoutFace(surayaIdentity, {
        name: "Suraya, Archangel of Knowledge",
        typeText: "Mystic Illusionist - Dragon Ally",
        types: typeBoxTokens(surayaArchangelOfKnowledge.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: surayaArchangelOfKnowledge.base.abilities,
        numeric: { power: 4 },
      }),
    }),
  },
});

export const { yellow: invokeSurayaYellow } = invokeSuraya.cards;
