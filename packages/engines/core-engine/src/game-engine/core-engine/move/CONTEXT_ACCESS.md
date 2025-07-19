# Context Access Improvement Summary

## Problem Statement

In the original implementation, moves accessed context through the `ctx` parameter, which could become stale during complex operations:

```typescript
export const originalMove = (
  { G, ctx, coreOps, playerID },
  ...args
) => {
  // ctx may be stale if there are context changes during move execution
};
```

## Solution

Our solution adds a `getCtx()` method to `CoreOperation` that always provides access to the most current context:

```typescript
export const betterMove = (
  { G, coreOps, playerID },
  ...args
) => {
  // Always get the freshest context
  const ctx = coreOps.getCtx();
};
```

## Changes Implemented

1. **Added `getCtx()` method to `CoreOperation` class**:
   ```typescript
   getCtx(): CoreCtx {
     return this.state.ctx;
   }
   ```

2. **Added deprecation notice to `ctx` in `FnContext`**:
   ```typescript
   // NOTE: ctx is deprecated - use coreOps.getCtx() instead to ensure you always have the latest context
   readonly ctx: CoreCtx;
   ```

3. **Created example move using the new pattern**:
   ```typescript
   export const moveCharacterToLocationImproved: LorcanaMove = (
     { G, coreOps, playerID },
     locationInstanceId: string,
     characterInstanceId: string,
   ) => {
     const ctx = coreOps.getCtx();
     // ...implementation...
   };
   ```

4. **Added documentation with clear patterns to follow**

## Benefits

1. **Always Fresh Data**: The context is always up-to-date when accessed through `coreOps.getCtx()`
2. **Consistency**: All game state manipulations go through the CoreOperation abstraction
3. **Cleaner Interface**: Move functions don't need to explicitly receive the context parameter
4. **Future-Proof**: Prepares the codebase for removing direct ctx access in the future

## Future Work

1. Consider making the `ctx` property in `FnContext` truly private/internal
2. Add an ESLint rule to detect direct ctx access in move functions
3. Gradually migrate all existing move implementations to use `coreOps.getCtx()` 