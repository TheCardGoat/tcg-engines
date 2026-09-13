import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/galvanic-bender.generated.ts";

/**
 * DYN089 Galvanic Bender — Mechanologist Arms d1 Battleworn.
 *
 * Printed: Material - While this is under a permanent, that permanent has
 * +1{p}. Battleworn
 *
 * Model notes (hand-authored):
 * - Material is a while static: under-a-permanent → host +1{p}. Dynasty RN:
 *   gets under via transform-into-permanent (Evo put-under family), not free
 *   placement. Host continuous needs under-zone + host selector (OPEN §7).
 * - Battleworn when equipped as Arms (normal seat).
 * - Model shape matches Ash/Material while pattern; runtime material blocked
 *   on under-attachment architecture (same gap as Hyper-X3 / Evo put-under).
 */
export const galvanicBender = defineCard(fabCardIdentitiesByCanonicalId["FdBq9qFfNpMbk67f7FRFL"], {
  keywords: [battleworn],
  abilities: {
    whileIsUnderPermanentPermanentHas1: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "source-is-subcard-of-host",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "host",
        },
        duration: "while-condition",
      },
      label: {
        name: "material",
      },
    },
  },
});
