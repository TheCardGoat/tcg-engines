/**
 * Transform-identity resolution shared by the transform proposal (which
 * attaches the incoming identity to committed `transform` events, CR 8.5.36a)
 * and the transform reducer (which rewrites object identity at reduce time).
 */
import type { FabDefinitionRegistry } from "../snapshot/match-context.ts";

/**
 * Resolve printed transform `into` to a registered cardDefinitions key.
 * Accepts catalog token slugs (`aether-ashwing`), English article residue
 * (`an-aether-ashwing`), Title Case, and bare canonical ids already registered.
 */
export function resolveTransformIntoCanonicalId(
  cardDefinitions: FabDefinitionRegistry,
  into: string,
): string | null {
  const candidates: string[] = [];
  const trimmed = into.trim();
  if (!trimmed) return null;
  candidates.push(trimmed);
  // Strip leading English articles from residual catalog models.
  const noArticle = trimmed.replace(/^(an|a|the)-/i, "").replace(/^(an|a|the)\s+/i, "");
  if (noArticle !== trimmed) candidates.push(noArticle);
  // Title Case / spaces → kebab slug.
  const kebab = noArticle
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (kebab) {
    candidates.push(kebab);
    candidates.push(`token:${kebab}`);
  }
  // Prefer token: prefix for ashwing-class transforms when both exist.
  for (const key of candidates) {
    if (cardDefinitions[key]) return key;
  }
  for (const key of candidates) {
    const tokenKey = key.startsWith("token:") ? key : `token:${key}`;
    if (cardDefinitions[tokenKey]) return tokenKey;
  }
  // Real-card transform-into (e.g. Singularity → "teklovossen-the-mechropotent"):
  // cardDefinitions is keyed by canonicalId, so resolve a matching printed slug.
  const slugCandidates = new Set([trimmed, noArticle, kebab].filter(Boolean));
  for (const def of Object.values(cardDefinitions)) {
    if (def.slug && slugCandidates.has(def.slug)) return def.canonicalId;
  }
  return null;
}
