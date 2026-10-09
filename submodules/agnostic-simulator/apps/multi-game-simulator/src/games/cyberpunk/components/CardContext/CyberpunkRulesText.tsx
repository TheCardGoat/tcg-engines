import { Fragment, type ReactNode } from "react";

import styles from "./CyberpunkRulesText.module.css";

type RulesPart =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "token"; readonly raw: string; readonly label: string }
  | { readonly kind: "break" };

const CYBERPUNK_ICON_BASE_URL = "https://r2.tcg.online/public/cyberpunk/icons";

const OFFICIAL_ABILITY_ICONS: Readonly<Record<string, string>> = {
  play: "play",
  call: "call",
  attack: "attack",
  defeated: "defeated",
  adrenaline: "adrenaline",
  quick: "quick",
  blocker: "blocker",
  gosolo: "go-solo",
  spend: "spend-filled",
};

/**
 * Game-owned rendering for the printed Cyberpunk `{Ability}` markers.
 * The simulator keeps this local because its React surface cannot import the
 * platform web app's Svelte renderer.
 */
export function CyberpunkRulesText({ text }: { readonly text: string }): ReactNode {
  return parseCyberpunkRulesText(text).map((part, index) => {
    if (part.kind === "break") return <br key={`break-${index}`} />;
    if (part.kind === "text") {
      return <Fragment key={`text-${index}`}>{renderText(part.value, index)}</Fragment>;
    }

    const icon = OFFICIAL_ABILITY_ICONS[tokenKey(part.raw)];
    return icon ? (
      <img
        key={`token-${index}`}
        className={styles.officialIcon}
        src={`${CYBERPUNK_ICON_BASE_URL}/${icon}.svg`}
        alt={part.label}
      />
    ) : (
      <span key={`token-${index}`} className={styles.fallbackToken}>
        {part.label}
      </span>
    );
  });
}

function renderText(value: string, index: number): ReactNode {
  return value.split(/(☆)/u).map((segment, segmentIndex) =>
    segment === "☆" ? (
      <span
        key={`street-cred-${index}-${segmentIndex}`}
        className={styles.streetCred}
        aria-hidden="true"
      >
        ☆
      </span>
    ) : (
      segment
    ),
  );
}

export function parseCyberpunkRulesText(text: string): readonly RulesPart[] {
  const parts: RulesPart[] = [];
  const tokenPattern = /\{([^{}]+)\}/gu;
  let cursor = 0;
  let match = tokenPattern.exec(text);

  while (match) {
    if (match.index > cursor) pushText(text.slice(cursor, match.index), parts);
    const raw = match[1]?.trim() ?? "";
    if (raw) parts.push({ kind: "token", raw, label: formatAbilityLabel(raw) });
    cursor = match.index + match[0].length;
    match = tokenPattern.exec(text);
  }

  if (cursor < text.length) pushText(text.slice(cursor), parts);
  return parts.filter(
    (part, index, all) =>
      part.kind !== "text" || !/^\s+$/u.test(part.value) || all[index + 1]?.kind !== "token",
  );
}

function pushText(value: string, parts: RulesPart[]): void {
  const lines = value.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line) parts.push({ kind: "text", value: line });
    if (index < lines.length - 1) parts.push({ kind: "break" });
  }
}

function tokenKey(raw: string): string {
  return raw
    .trim()
    .replace(/[\s_-]+/gu, "")
    .toLowerCase();
}

function formatAbilityLabel(raw: string): string {
  return raw.replace(/([a-z])([A-Z])/gu, "$1 $2").toUpperCase();
}
