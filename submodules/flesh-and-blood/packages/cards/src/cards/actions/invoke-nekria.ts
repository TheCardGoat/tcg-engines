import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-nekria.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { nekria } from "../allies/nekria.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeNekriaIdentity = fabPitchFamilies["invoke-nekria"].variants.red;
const nekriaIdentity = fabCardIdentitiesByCanonicalId["b886KqRJLbpj78kHWMQJ9"];
const invokeNekriaAbilities = expandSemanticAbilities(invokeNekriaIdentity.canonicalId, {
  transformAshIntoNekria: {
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

export const invokeNekria = definePitchFamily(fabPitchFamilies["invoke-nekria"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeNekriaIdentity, {
        name: "Invoke Nekria",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeNekriaAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 3, defense: 3 },
      }),
      back: defineLayoutFace(nekriaIdentity, {
        name: "Nekria",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(nekria.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: nekria.base.abilities,
        numeric: { power: 4 },
      }),
    }),
  },
});

export const { red: invokeNekriaRed } = invokeNekria.cards;
