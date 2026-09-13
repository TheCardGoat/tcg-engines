import type { ReactNode } from "react";

import { FabOfficialIcon } from "./FabIconography";
import styles from "./FabSymbolText.module.css";

const FAB_INLINE_SYMBOLS = {
  "{r}": { icon: "resource", label: "resource" },
  "{p}": { icon: "power", label: "power" },
  "{d}": { icon: "defense", label: "defense" },
  "{h}": { icon: "life", label: "life" },
  "{i}": { icon: "intellect", label: "intellect" },
  "{c}": { icon: "chi", label: "chi" },
  "{t}": { icon: "tap", label: "tap" },
  "{u}": { icon: "untap", label: "untap" },
} as const;

type FabInlineSymbol = keyof typeof FAB_INLINE_SYMBOLS;

function isFabInlineSymbol(value: string): value is FabInlineSymbol {
  return Object.hasOwn(FAB_INLINE_SYMBOLS, value);
}

/** Replace only canonical FAB symbol tokens; unfamiliar braces remain readable text. */
export function FabSymbolText({ text }: { text: string }): ReactNode {
  return text.split(/(\{[a-z]+\})/gu).map((part, index) => {
    if (!isFabInlineSymbol(part)) return part;
    const symbol = FAB_INLINE_SYMBOLS[part];
    return (
      <span
        key={`${part}:${index}`}
        className={styles.inlineSymbol}
        title={symbol.label}
        data-fab-inline-symbol={symbol.icon}
      >
        <FabOfficialIcon id={symbol.icon} size={14} alt={symbol.label} />
      </span>
    );
  });
}
