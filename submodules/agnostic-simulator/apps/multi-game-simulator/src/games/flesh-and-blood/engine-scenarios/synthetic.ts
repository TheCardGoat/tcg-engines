import {
  toFabCardDefinition,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
} from "@tcg/flesh-and-blood-engine/simulator";

export function placeholderDefinitionBase(
  definition: FabCardDefinitionInput,
): Omit<FabRegisteredCardDefinition, "slug"> {
  const { slug: _catalogSlug, ...placeholderBase } = toFabCardDefinition(definition);
  return placeholderBase;
}
