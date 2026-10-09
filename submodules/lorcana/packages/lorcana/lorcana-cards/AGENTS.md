# Lorcana Cards

Owns typed definitions, helpers, generated exports, and card behavior tests.
Use the [lorcana-cards skill](../../../.agents/skills/lorcana-cards/SKILL.md)
for single-card work; its `PATTERNS.md` covers authoring details.

- Cards with rules text use `abilities`; vanilla cards use `vanilla: true`.
- Clear `missingImplementation` and `missingTests` when the implementation
  and active behavioral test are complete.
- Enchanted and epic reprints share their base card's `canonicalId` and abilities.
- Test what the card does through public actions. Stubs, empty tests, and
  keyword-presence checks do not prove behavior.
- Keep general engine edge cases in engine or simulator tests.

Validate locally with focused card behavior tests and relevant type or export
checks. If a case needs the simulator's `src/testing/` harness, run that test
directly; its location does not require a running simulator or platform.
