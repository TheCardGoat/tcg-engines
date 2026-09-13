/**
 * Shared FAB iconography components for combat chain, card stats, and HUD.
 * Official symbols use CDN (PR #87 / R2) with local fallback; keywords use Lucide.
 */

import { Swords } from "lucide-react";
import { useState } from "react";
import { useAnimationNode } from "@tcg/simulator-ui";

import type { FabOfficialIconId } from "./fabIcons";
import {
  fabOfficialIconCdnUrl,
  fabOfficialIconLocalUrl,
  fabPitchIconId,
  sortFabKeywordsForChain,
  type FabKeywordIconDef,
} from "./fabIcons";

export function FabOfficialIcon({
  id,
  size = 16,
  className,
  alt = "",
}: {
  id: FabOfficialIconId;
  size?: number;
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState(() => fabOfficialIconCdnUrl(id));
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className ?? "fab-official-icon"}
      data-fab-icon={id}
      data-testid={`fab-icon-${id}`}
      draggable={false}
      onError={() => {
        const local = fabOfficialIconLocalUrl(id);
        if (src !== local) setSrc(local);
      }}
    />
  );
}

/**
 * Power / defense / resource / life readout with the official glyph + value.
 * Prefer this over plain Lucide swords/shields whenever a printed stat is shown.
 */
export function FabStatBadge({
  stat,
  value,
  label,
  size = "md",
  showLabel = true,
  testId,
}: {
  stat: "power" | "defense" | "resource" | "life" | "intellect" | "cost";
  value: number | string;
  /** Override visible label (default: capitalized stat name). */
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  testId?: string;
}) {
  const displayLabel = label ?? stat;
  const iconSize = size === "lg" ? 22 : size === "sm" ? 14 : 18;
  return (
    <span
      className={`fab-stat-badge fab-stat-badge--${stat} fab-stat-badge--${size}`}
      data-stat={stat}
      data-testid={testId ?? `fab-stat-badge-${stat}`}
      aria-label={`${value} ${displayLabel}`}
    >
      <FabOfficialIcon id={stat} size={iconSize} className="fab-stat-badge-icon" />
      <strong className="fab-stat-badge-value">{value}</strong>
      {showLabel ? <small className="fab-stat-badge-label">{displayLabel}</small> : null}
    </span>
  );
}

/**
 * Compact life / resources / AP strip for hero HUD (desktop seat + mobile rails).
 */
export function FabAssetMeters({
  playerId,
  life,
  resourcePoints,
  chiPoints = 0,
  actionPoints,
  density = "desktop",
  showActionPoints = true,
}: {
  playerId: string;
  life: number;
  resourcePoints: number;
  chiPoints?: number;
  actionPoints?: number;
  density?: "desktop" | "mobile" | "compact";
  showActionPoints?: boolean;
}) {
  const size = density === "desktop" ? "md" : "sm";
  const lifeRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:life` },
    { presence: "present" },
  );
  const resourceRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:resource` },
    { presence: "present" },
  );
  const chiRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:chi` },
    { presence: "present" },
  );
  const actionRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:action` },
    { presence: "present" },
  );
  return (
    <div
      className={`fab-asset-meters fab-asset-meters--${density}`}
      data-testid="fab-asset-meters"
      role="group"
      aria-label="Life and resources"
    >
      <span ref={lifeRef} className="fab-animation-value-anchor">
        <FabStatBadge
          stat="life"
          value={life}
          label="Life"
          size={size}
          showLabel={density === "desktop"}
          testId="fab-asset-life"
        />
      </span>
      <span ref={resourceRef} className="fab-animation-value-anchor">
        <FabStatBadge
          stat="resource"
          value={resourcePoints}
          label="Resources"
          size={size}
          showLabel={density === "desktop"}
          testId="fab-asset-resources"
        />
      </span>
      {chiPoints > 0 ? (
        <span ref={chiRef} className="fab-animation-value-anchor">
          <span
            className={`fab-stat-badge fab-stat-badge--${size}`}
            aria-label={`${chiPoints} chi`}
          >
            <FabOfficialIcon id="chi" size={size === "md" ? 18 : 14} />
            <strong className="fab-stat-badge-value">{chiPoints}</strong>
            {density === "desktop" ? <small className="fab-stat-badge-label">Chi</small> : null}
          </span>
        </span>
      ) : null}
      {showActionPoints && actionPoints != null ? (
        <span
          ref={actionRef}
          className={`fab-ap-badge fab-ap-badge--${density}`}
          data-testid="fab-asset-ap"
          aria-label={`${actionPoints} action ${actionPoints === 1 ? "point" : "points"}`}
        >
          {density === "desktop" ? <Swords aria-hidden="true" size={18} strokeWidth={1.8} /> : null}
          <strong>{actionPoints}</strong>
          {density === "desktop" ? <small>AP</small> : <span className="visually-hidden">AP</span>}
        </span>
      ) : null}
    </div>
  );
}

export function FabPitchGem({ pitch, size = 16 }: { pitch: number; size?: number }) {
  const id = fabPitchIconId(pitch);
  if (!id) {
    return (
      <span
        className="fab-card-pitch-gem"
        data-decoration-id={`fab-pitch-${pitch}`}
        aria-hidden="true"
      >
        {pitch}
      </span>
    );
  }
  const pitchLabel = pitch === 1 ? "Red" : pitch === 2 ? "Yellow" : pitch === 3 ? "Blue" : "Purple";
  return (
    <span
      className="fab-pitch-gem"
      data-decoration-id={`fab-pitch-${pitch}`}
      data-pitch={pitch}
      aria-label={`${pitchLabel} pitch: ${pitch}`}
    >
      <FabOfficialIcon id={id} size={size} className="fab-pitch-gem-icon" />
      <span className="fab-pitch-gem-value" aria-hidden="true">
        {pitch}
      </span>
    </span>
  );
}

/** Official resource glyph used as the pitch-zone mark (pitch generates resources). */
export function FabPitchZoneIcon({ size = 16 }: { size?: number }) {
  return <FabOfficialIcon id="resource" size={size} className="fab-zone-official-icon" alt="" />;
}

function KeywordChip({ def, compact = false }: { def: FabKeywordIconDef; compact?: boolean }) {
  const Icon = def.Lucide;
  return (
    <li
      className="fab-chain-keyword"
      data-keyword={def.id}
      data-testid={`fab-keyword-${def.id}`}
      data-tooltip={def.hint}
      tabIndex={0}
    >
      <Icon
        className="fab-chain-keyword-icon"
        size={compact ? 15 : 12}
        strokeWidth={2.2}
        aria-hidden="true"
      />
      <span className="fab-chain-keyword-label">{compact ? def.shortCode : def.label}</span>
      <span className="visually-hidden">{def.hint}</span>
    </li>
  );
}

/** Combat-chain keyword row: icon + label chips, sorted by chain priority. */
export function FabKeywordRow({
  keywords,
  compact = false,
  className,
}: {
  keywords: readonly string[];
  compact?: boolean;
  className?: string;
}) {
  const defs = sortFabKeywordsForChain(keywords);
  if (defs.length === 0) return null;
  return (
    <ul
      className={className ?? "fab-chain-keywords"}
      data-testid="fab-chain-keywords"
      aria-label="Attack keywords"
    >
      {defs.map((def) => (
        <KeywordChip key={def.id} def={def} compact={compact} />
      ))}
    </ul>
  );
}
