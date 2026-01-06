/**
 * Stub for propertyStaticAbilities module
 * Created for legacy card migration
 */
export const propertyStaticAbilities = (config: {
  name: string;
  text: string;
  attribute: string;
  amount: unknown;
}) => ({
  type: "static" as const,
  name: config.name,
  text: config.text,
  attribute: config.attribute,
  amount: config.amount,
});

export const yourCharactersNamedGain = () => ({
  type: "static" as const,
  text: "Your characters named gain...",
});
