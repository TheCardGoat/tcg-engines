# Extending Lorcana Engine Variants

Use this reference when adding a condition, target, or effect discriminator.

## Condition

1. Add the interface to the `Condition` union in
   `lorcana-types/src/abilities/condition-types.ts`.
2. Add the branch to `evaluateCondition` in
   `src/rules/condition-evaluator.ts`.
3. Add the discriminator to `CONDITION_VARIANT_TYPES`.
4. Add `src/rules/conditions/__tests__/<type>.test.ts`.

## Target

1. Add the selector or reference to
   `lorcana-types/src/targeting/lorcana-target-dsl.ts`.
2. Implement resolution under `src/targeting/runtime/` and update shared
   normalization when required.
3. Add the discriminator to `TARGET_VARIANT_TYPES` in
   `src/targeting/variants/index.ts`.
4. Add `src/targeting/variants/__tests__/<type>.test.ts`.

## Effect

1. Define and export the effect interface under
   `lorcana-types/src/abilities/effect-types/`.
2. Add `<type>-effect.ts` under
   `src/runtime-moves/resolution/action-effects/`, exporting its type guard and
   resolver.
3. Register both the discriminator in `ACTION_EFFECT_RESOLVER_TYPES` and the
   resolver in `actionEffectResolvers` within `composed-effect-resolver.ts`.
4. Add a focused test under the adjacent `__tests__/` directory.

## Evidence

The focused test must execute the primary mutation through the smallest
available engine harness. Add explicit edge cases that establish the variant's
contract; do not leave `.todo` placeholders as the only non-happy-path proof.
