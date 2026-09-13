import type { FabPresentationDefinition } from "./cardArt";
import { isFabFixtureArtPlaceholder } from "./fixture-art-placeholders";

/** Reviewed artwork for fixture stand-ins whose labels deliberately differ from printed names. */
const FIXTURE_PRESENTATION_REFERENCES: Readonly<Record<string, string>> = {
  "viz-blue-action": "cQD9DmppBQNGqb9CdqCRc", // Nimblism, blue
  "fixture-red-in-the-ledger": "FLHmj9MjCgFPBzgFGKRFW", // Red in the Ledger, red
  "fixture-searing-shot": "GWJzpmmcLCPm6bbfM8zR9", // Searing Shot, red
  "viz-herald": "QD7K9HmH9g9CLWRPcz87n", // Herald of Triumph, red
  "viz-hyper-driver": "FwwCqJKcNDNMjJn9mTCgg", // Hyper Driver, token
  "viz-hero-dorinthea": "Djhg6DMpCpFHD9rcPNFrN", // Dorinthea Ironsong
  "viz-hero-melody": "npDPz98H6BnJGDzHBmdGk", // Melody, Sing-along
  "viz-hero-zyggy": "pnwGDgknLbHc96Ghg8f67", // Zyggy Starlight
};
export function fixturePresentationCanonicalId(canonicalId: string): string | undefined {
  return FIXTURE_PRESENTATION_REFERENCES[canonicalId];
}

export function fixturePresentationDefinitions(
  definitions: readonly FabPresentationDefinition[],
): readonly FabPresentationDefinition[] {
  return definitions
    .filter((definition) => !isFabFixtureArtPlaceholder(definition.canonicalId))
    .map((definition) => {
      const presentationReference = FIXTURE_PRESENTATION_REFERENCES[definition.canonicalId];
      return presentationReference ? { ...definition, presentationReference } : definition;
    });
}
