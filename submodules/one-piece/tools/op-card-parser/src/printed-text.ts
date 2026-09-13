/**
 * Build the English ability string fed to `buildCardEffects`.
 *
 * Some cards store the Trigger clause on `trigger` already prefixed with
 * `[Trigger]`; others store only the body. Never double-prefix.
 * If `effect` already contains a Trigger section, the separate field is ignored.
 */
export function joinPrintedAbilityText(options: {
  effect?: string | null;
  trigger?: string | null;
}): string {
  const rawEffect = options.effect?.trim();
  const effectText = rawEffect && !/^(?:NULL|-)$/i.test(rawEffect) ? rawEffect : undefined;

  if (effectText && /(?:^|\n)\s*\[Trigger\]/i.test(effectText)) {
    return effectText;
  }

  const rawTrigger = options.trigger?.trim();
  if (!rawTrigger || /^(?:NULL|-)$/i.test(rawTrigger)) {
    return effectText ?? "";
  }

  const triggerBody = rawTrigger.replace(/^\[Trigger\]\s*/i, "").trim();
  if (!triggerBody) {
    return effectText ?? "";
  }

  const triggerLine = `[Trigger] ${triggerBody}`;
  return [effectText, triggerLine].filter(Boolean).join("\n");
}
