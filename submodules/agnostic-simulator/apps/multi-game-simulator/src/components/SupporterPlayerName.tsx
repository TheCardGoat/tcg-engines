import type { CSSProperties, ReactNode } from "react";
import { Gem, ShieldCheck, Sparkles, Star } from "lucide-react";
import { formatSupporterAriaLabel, getSupporterDisplayConfig } from "@tcg/shared/supporter-display";

import "./supporter-player-name.css";

export interface SupporterPlayerNameProps {
  readonly name: string;
  readonly tier?: string | null;
  readonly profileHref?: string;
  readonly trailing?: ReactNode;
  readonly className?: string;
}

const SUPPORTER_ICON = {
  star: Star,
  gem: Gem,
  shield: ShieldCheck,
  sparkles: Sparkles,
} as const;

export function SupporterPlayerName({
  name,
  tier,
  profileHref,
  trailing,
  className = "",
}: SupporterPlayerNameProps) {
  const config = getSupporterDisplayConfig(tier);
  const Icon = config ? SUPPORTER_ICON[config.icon] : null;
  const style = config
    ? ({
        "--supporter-color": config.color,
        "--supporter-glow": config.glow,
        "--supporter-background": config.background,
        "--supporter-border": config.border,
      } as CSSProperties)
    : undefined;
  const content = (
    <>
      {Icon ? <Icon className="supporter-player-name__icon" aria-hidden="true" /> : null}
      <span className="supporter-player-name__text">{name}</span>
      {trailing}
    </>
  );
  const classes = `supporter-player-name ${config ? "is-supporter" : ""} ${className}`.trim();

  return profileHref ? (
    <a
      className={classes}
      href={profileHref}
      target="_blank"
      rel="noreferrer"
      style={style}
      aria-label={`${formatSupporterAriaLabel(name, tier)} profile`}
    >
      {content}
    </a>
  ) : (
    <span className={classes} style={style} aria-label={formatSupporterAriaLabel(name, tier)}>
      {content}
    </span>
  );
}
