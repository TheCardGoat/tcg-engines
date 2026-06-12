import type { AgentProvider, AgentProviderId, GameAgent } from "./types";

const agents = new Map<string, GameAgent>();
const providers = new Map<AgentProviderId, AgentProvider>();

/**
 * Register a per-game agent. Idempotent — calling twice with the same slug
 * overwrites the prior registration. Per-game agent packages call this in
 * their `index.ts` on import; the host app imports those packages at startup
 * to wire everything up.
 */
export function registerAgent(agent: GameAgent): void {
  agents.set(agent.slug, agent);
}

/** Look up a game agent by slug; returns `undefined` so callers can choose to
 *  fall back to heuristic cleanly rather than throw. */
export function getAgent(slug: string): GameAgent | undefined {
  return agents.get(slug);
}

export function hasAgent(slug: string): boolean {
  return agents.has(slug);
}

export function listAgents(): GameAgent[] {
  return [...agents.values()];
}

/** Register an LLM provider implementation. Idempotent. */
export function registerProvider(provider: AgentProvider): void {
  providers.set(provider.id, provider);
}

export function getProvider(id: AgentProviderId): AgentProvider | undefined {
  return providers.get(id);
}

export function hasProvider(id: AgentProviderId): boolean {
  return providers.has(id);
}

/** Test-only: clear both registries between test runs. */
export function __resetAgentRegistryForTests(): void {
  agents.clear();
  providers.clear();
}
