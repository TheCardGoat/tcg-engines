import type {
  FabBaseObjectProperties,
  FabKeyword,
  FabNumericProperty,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import type { FabContinuousApplication, FabObjectRef } from "../continuous/ir.ts";
import type { FabPropertyProvenance, FabRulesBaseObject } from "../rules-view.ts";

export interface MutableProperties {
  names: string[];
  activeFaceIds: FabBaseObjectProperties["activeFaceIds"][number][];
  color: FabBaseObjectProperties["color"];
  typeBoxes: FabBaseObjectProperties["typeBoxes"][number][];
  metatypes: FabBaseObjectProperties["typeBox"]["metatypes"][number][];
  supertypes: FabBaseObjectProperties["typeBox"]["supertypes"][number][];
  types: FabBaseObjectProperties["typeBox"]["types"][number][];
  subtypes: FabBaseObjectProperties["typeBox"]["subtypes"][number][];
  traits: FabBaseObjectProperties["traits"][number][];
  textBoxIds: string[];
  numeric: Partial<Record<FabNumericProperty, number>>;
  keywords: FabKeyword[];
  abilities: FleshAndBloodAbility[];
}

export interface MutableObject {
  readonly input: FabRulesBaseObject;
  controllerId: string | null;
  properties: MutableProperties;
  copyable: FabBaseObjectProperties | null;
  /** Stage-7 result, kept separate once stage 8 starts mutating current values. */
  baseNumeric: Partial<Record<FabNumericProperty, number>>;
  readonly added: {
    types: Map<string, string>;
    subtypes: Map<string, string>;
    supertypes: Map<string, string>;
    keywords: Map<string, string>;
    abilities: Map<string, string>;
  };
  readonly provenance: FabPropertyProvenance[];
  readonly effectIds: Set<string>;
  readonly applications: FabContinuousApplication[];
}

export function cloneBase(base: FabBaseObjectProperties): MutableProperties {
  return {
    names: [...base.names],
    activeFaceIds: [...base.activeFaceIds],
    color: base.color,
    typeBoxes: [...base.typeBoxes],
    metatypes: [...base.typeBox.metatypes],
    supertypes: [...base.typeBox.supertypes],
    types: [...base.typeBox.types],
    subtypes: [...base.typeBox.subtypes],
    traits: [...base.traits],
    textBoxIds: [...base.textBoxIds],
    numeric: { ...base.numeric },
    keywords: [...base.keywords],
    abilities: [...base.abilities],
  };
}

export function cloneMutable(properties: MutableProperties): MutableProperties {
  return {
    ...properties,
    names: [...properties.names],
    activeFaceIds: [...properties.activeFaceIds],
    typeBoxes: [...properties.typeBoxes],
    metatypes: [...properties.metatypes],
    supertypes: [...properties.supertypes],
    types: [...properties.types],
    subtypes: [...properties.subtypes],
    traits: [...properties.traits],
    textBoxIds: [...properties.textBoxIds],
    numeric: { ...properties.numeric },
    keywords: [...properties.keywords],
    abilities: [...properties.abilities],
  };
}

export function createMutableObject(input: FabRulesBaseObject): MutableObject {
  const initial = input.current ?? input.base;
  return {
    input,
    controllerId: input.controllerId,
    properties: cloneBase(initial),
    copyable: input.copyable ?? null,
    baseNumeric: { ...(input.baseNumeric ?? input.base.numeric) },
    added: {
      types: new Map(),
      subtypes: new Map(),
      supertypes: new Map(),
      keywords: new Map(),
      abilities: new Map(),
    },
    provenance: [],
    effectIds: new Set(),
    applications: [],
  };
}

export function refKey(ref: FabObjectRef): string {
  return `${ref.instanceId}#${ref.incarnation}`;
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
