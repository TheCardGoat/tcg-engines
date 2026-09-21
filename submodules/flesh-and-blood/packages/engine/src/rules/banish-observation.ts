import type { FabBaseObjectProperties } from "@tcg/flesh-and-blood-types";
import type { FabObjectSnapshot } from "./events.ts";

/** CR 3.0.7a: a private-to-private move has no properties for effects.
 * Banished is public (3.4.1), except when the move explicitly banishes face-down.
 * CR 3.0.8 makes a public object private before it moves to a private
 * destination, so a face-down banish is private-to-private from any origin.
 * Keep physical identity/ownership separate from the observable card properties.
 */
export function banishedObjectForRules(data: {
  readonly object: FabObjectSnapshot;
  readonly faceDown?: boolean;
}): FabObjectSnapshot {
  const object = data.object;
  if (data.faceDown !== true) return object;
  const emptyTypeBox = { metatypes: [], supertypes: [], types: [], subtypes: [] } as const;
  const properties: FabBaseObjectProperties = {
    names: [],
    // Face identity is engine metadata; none of its printed properties apply.
    activeFaceIds: object.base.activeFaceIds,
    color: null,
    typeBoxes: [emptyTypeBox],
    typeBox: emptyTypeBox,
    traits: [],
    textBoxIds: [],
    numeric: {},
    keywords: [],
    abilities: [],
  };
  return {
    ...object,
    canonicalId: null,
    base: properties,
    copyable: properties,
    baseNumeric: {},
    current: properties,
  };
}
