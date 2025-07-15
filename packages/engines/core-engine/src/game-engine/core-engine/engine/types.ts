// biome-ignore lint/suspicious/noShadowRestrictedNames: Object import from ts-toolbelt is necessary
import type { Object } from "ts-toolbelt";

// ActionShape namespace removed - types were unused

// ActionPayload namespace removed - depended on removed ActionShape types

export namespace CredentialedActionShape {
  // Note: These types are kept for backward compatibility but reference private functions
  // They should only be used internally within the action system
  export type Any = never; // Placeholder since the referenced functions are now private
}
