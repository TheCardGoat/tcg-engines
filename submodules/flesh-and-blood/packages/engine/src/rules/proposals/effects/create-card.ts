import type { FabBaseObjectProperties, FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import {
  baseEvent,
  canonicalEngineZone,
  heroTargets,
  playersForFabPlayer,
  unsupported,
} from "../shared.ts";
import { createSyntheticFabObjectSnapshot } from "../../snapshots.ts";
import { createIsRestricted } from "../../create-restrictions.ts";
import { basePropertiesOf, normalizeBaseObjectProperties } from "../../../cards.ts";
import { fabPlayerId } from "../../../game/identity.ts";

/**
 * CR 8.5.40 Create a card (non-token catalog identity) into a destination.
 * Looks up a registered definition by name when present; otherwise synthesizes
 * a named generic action so the create event can commit.
 */
export function proposeCreateCard(
  ctx: ProposalContext,
  effect: FabEffect & { type: "create-card" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const playerIds = effect.target
    ? heroTargets(state, layer, effect.target, targetPath, effectTargets, effectPath)
    : playersForFabPlayer(
        state,
        layer.controllerId,
        effect.controller ?? "controller",
        layer.bindings,
      );
  if (!playerIds || playerIds.length !== 1) {
    return unsupported(effect, "create-card controller is unresolved");
  }
  const playerId = playerIds[0]!;
  const destZone = effect.to.zone ? (canonicalEngineZone(effect.to.zone) ?? "arena") : "arena";

  const resolved = resolveCreatedCardDefinition(state, effect.name, effect.pitch);
  let canonicalId = resolved?.canonicalId ?? null;
  let base = resolved?.base ?? null;
  canonicalId ??= `created:${slugifyCreatedCardName(effect.name)}`;
  base ??= normalizeBaseObjectProperties({
    canonicalId,
    name: effect.name,
    types: ["Action"],
    pitch: effect.pitch,
  });
  // `base ??=` does not narrow the flow type; guard explicitly.
  if (!base) return unsupported(effect, "create-card base properties are unresolved");

  const instanceId = `${processId}:${layer.layerId}:create-card`;
  const object = createSyntheticFabObjectSnapshot({
    ref: { instanceId, incarnation: state.counters.objectIncarnation + 1 },
    canonicalId,
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: playerId,
    controllerId: playerId,
    zone: "unknown",
    zoneRef: { playerId: fabPlayerId(playerId), zone: destZone },
    base,
  });

  if (createIsRestricted(state, layer.source, object)) {
    return { supported: true, events: [] };
  }

  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "create",
        affected: [object],
        bindings: { "created-card": object },
        data: { playerId, object },
      },
    ],
  };
}

function slugifyCreatedCardName(name: string): string {
  return name
    .replace(/^token:/i, "")
    .trim()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function resolveCreatedCardDefinition(
  state: ProposalContext["state"],
  name: string,
  pitch?: number,
): { readonly canonicalId: string; readonly base: FabBaseObjectProperties } | null {
  const slug = slugifyCreatedCardName(name);
  const aliases = new Set([name, slug, `token:${slug}`, `created:${slug}`]);
  for (const [id, def] of Object.entries(state.cardDefinitions)) {
    const defSlug = def.slug ? slugifyCreatedCardName(def.slug) : "";
    const defSlugBase = defSlug.replace(/-(red|yellow|blue)$/i, "");
    const matches =
      aliases.has(id) ||
      def.base.names.includes(name) ||
      def.canonicalId === name ||
      defSlug === slug ||
      defSlugBase === slug ||
      def.base.names.some((printedName) => slugifyCreatedCardName(printedName) === slug);
    if (!matches) continue;
    if (
      pitch !== undefined &&
      def.base.numeric.pitch !== undefined &&
      def.base.numeric.pitch !== pitch
    )
      continue;
    const canonicalId = def.canonicalId || id;
    return { canonicalId, base: basePropertiesOf(def) };
  }
  return null;
}
