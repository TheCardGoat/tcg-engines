# Telemetry System

Event-based telemetry system for `@tcg/core` to track player actions, engine events, and performance metrics.

## Overview

The telemetry system provides:
- **Event Tracking**: Capture all player actions and engine events
- **Dual API**: EventEmitter style + callback hooks
- **Type-Safe Events**: Discriminated unions for compile-time safety
- **Analytics Integration**: Easy integration with analytics services
- **Performance Monitoring**: Track operation timing and metrics
- **Error Tracking**: Capture and report engine errors

## Quick Start

```typescript
import { RuleEngine } from '@tcg/core';

const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        console.log(`${event.playerId} executed ${event.moveId}`);
      }
    }
  }
});
```

## Event Types

The telemetry system emits six event types:

### 1. PlayerActionEvent
Emitted when a player executes a move.

```typescript
type PlayerActionEvent = {
  type: 'playerAction';
  moveId: string;
  playerId: PlayerId;
  params: unknown;
  result: 'success' | 'failure';
  error?: string;
  errorCode?: string;
  duration: number;
  timestamp: number;
};
```

**Use Cases:**
- Player behavior analysis
- Move frequency tracking
- Performance monitoring
- Replay generation
- Achievement tracking

**Example:**
```typescript
{
  type: 'playerAction',
  moveId: 'playCard',
  playerId: 'player-1',
  params: { cardId: 'card-42' },
  result: 'success',
  duration: 15,
  timestamp: 1634567890123
}
```

### 2. StateChangeEvent
Emitted after state mutations with forward/inverse patches.

```typescript
type StateChangeEvent = {
  type: 'stateChange';
  patches: Patch[];
  inversePatches: Patch[];
  moveId?: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
  timestamp: number;
};
```

**Use Cases:**
- Network synchronization
- State replay/reconstruction
- Debugging state issues
- Audit trails
- Time-travel debugging

**Example:**
```typescript
{
  type: 'stateChange',
  patches: [
    { op: 'replace', path: ['players', 0, 'health'], value: 15 }
  ],
  inversePatches: [
    { op: 'replace', path: ['players', 0, 'health'], value: 20 }
  ],
  moveId: 'attack',
  timestamp: 1634567890123
}
```

### 3. RuleEvaluationEvent
Emitted during condition checks and rule evaluations.

```typescript
type RuleEvaluationEvent = {
  type: 'ruleEvaluation';
  ruleName: string;
  result: boolean;
  context: Record<string, unknown>;
  duration?: number;
  timestamp: number;
};
```

**Use Cases:**
- Debugging rule interactions
- Understanding game decisions
- AI training data
- Balance analysis
- Rule coverage metrics

**Example:**
```typescript
{
  type: 'ruleEvaluation',
  ruleName: 'canPlayCard',
  result: true,
  context: { cardId: 'card-42', manaCost: 3, availableMana: 5 },
  duration: 2,
  timestamp: 1634567890123
}
```

### 4. FlowTransitionEvent
Emitted during game flow transitions (phases, turns, segments).

```typescript
type FlowTransitionEvent = {
  type: 'flowTransition';
  transitionType: 'phase' | 'segment' | 'turn';
  from: string;
  to: string;
  turn: number;
  timestamp: number;
};
```

**Use Cases:**
- Game pacing analysis
- Turn timing metrics
- Flow debugging
- UI synchronization
- Tutorial triggers

**Example:**
```typescript
{
  type: 'flowTransition',
  transitionType: 'phase',
  from: 'main',
  to: 'combat',
  turn: 1,
  timestamp: 1634567890123
}
```

### 5. EngineErrorEvent
Emitted when errors occur during engine execution.

```typescript
type EngineErrorEvent = {
  type: 'engineError';
  error: string;
  stack?: string;
  context: Record<string, unknown>;
  moveId?: string;
  playerId?: PlayerId;
  timestamp: number;
};
```

**Use Cases:**
- Error tracking and reporting
- System health monitoring
- Bug reproduction
- Alert generation
- Support debugging

**Example:**
```typescript
{
  type: 'engineError',
  error: 'Invalid card ID',
  stack: 'Error: Invalid card ID\n  at ...',
  context: { cardId: 'invalid-123', moveId: 'playCard' },
  moveId: 'playCard',
  playerId: 'player-1',
  timestamp: 1634567890123
}
```

### 6. PerformanceEvent
Emitted for performance-sensitive operations.

```typescript
type PerformanceEvent = {
  type: 'performance';
  operation: string;
  duration: number;
  metadata?: Record<string, unknown>;
  timestamp: number;
};
```

**Use Cases:**
- Performance profiling
- Bottleneck identification
- Optimization validation
- Resource monitoring
- SLA tracking

**Example:**
```typescript
{
  type: 'performance',
  operation: 'moveExecution',
  duration: 15,
  metadata: { moveId: 'playCard', patchCount: 3 },
  timestamp: 1634567890123
}
```

## Using Telemetry

### Initialization with Hooks

Register hooks during engine initialization:

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        analytics.track('game.move', {
          moveId: event.moveId,
          playerId: event.playerId,
          duration: event.duration
        });
      },
      onStateChange: (event) => {
        database.savePatches(event.patches);
      },
      onEngineError: (event) => {
        errorReporter.captureException(event.error, event.context);
      }
    }
  }
});
```

### EventEmitter Style

Subscribe to events at runtime using the EventEmitter API:

```typescript
const telemetry = engine.getTelemetry();

telemetry.on('playerAction', (event) => {
  console.log(`Move: ${event.moveId}, Result: ${event.result}`);
});

telemetry.on('flowTransition', (event) => {
  console.log(`${event.from} -> ${event.to}`);
});

telemetry.on('engineError', (event) => {
  console.error('Engine error:', event.error);
});
```

### Dynamic Hook Registration

Register hooks after initialization:

```typescript
const telemetry = engine.getTelemetry();

const playerActionHandler = (event) => {
  if (event.result === 'failure') {
    console.warn('Move failed:', event.error);
  }
};

telemetry.registerHook('onPlayerAction', playerActionHandler);

// Later, unregister
telemetry.unregisterHook('onPlayerAction', playerActionHandler);
```

### Enable/Disable at Runtime

```typescript
const telemetry = engine.getTelemetry();

// Disable telemetry
telemetry.setEnabled(false);

// Re-enable telemetry
telemetry.setEnabled(true);

// Check status
if (telemetry.isEnabled()) {
  console.log('Telemetry is active');
}
```

## Integration Examples

### Analytics Integration

```typescript
import Analytics from 'analytics';

const analytics = Analytics({
  app: 'my-tcg-game',
  plugins: [
    // Your analytics plugins
  ]
});

const engine = new RuleEngine(gameDefinition, players, {
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        analytics.track('game.move.executed', {
          moveId: event.moveId,
          playerId: event.playerId,
          result: event.result,
          duration: event.duration
        });
      },
      onFlowTransition: (event) => {
        analytics.track('game.flow.transition', {
          type: event.transitionType,
          from: event.from,
          to: event.to,
          turn: event.turn
        });
      }
    }
  }
});
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const engine = new RuleEngine(gameDefinition, players, {
  telemetry: {
    enabled: true,
    hooks: {
      onEngineError: (event) => {
        Sentry.captureException(new Error(event.error), {
          contexts: {
            game: event.context,
            move: {
              moveId: event.moveId,
              playerId: event.playerId
            }
          },
          tags: {
            errorCode: event.context.errorCode,
            moveId: event.moveId
          }
        });
      }
    }
  }
});
```

### Database Persistence

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  telemetry: {
    enabled: true,
    hooks: {
      onStateChange: async (event) => {
        await database.gameStates.create({
          gameId: gameId,
          patches: event.patches,
          inversePatches: event.inversePatches,
          moveId: event.moveId,
          timestamp: event.timestamp
        });
      },
      onPlayerAction: async (event) => {
        await database.playerActions.create({
          gameId: gameId,
          moveId: event.moveId,
          playerId: event.playerId,
          params: event.params,
          result: event.result,
          duration: event.duration,
          timestamp: event.timestamp
        });
      }
    }
  }
});
```

### Performance Monitoring

```typescript
const performanceMetrics = {
  moves: [] as number[],
  transitions: [] as number[]
};

const engine = new RuleEngine(gameDefinition, players, {
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        performanceMetrics.moves.push(event.duration);
        
        // Alert on slow moves
        if (event.duration > 100) {
          console.warn(`Slow move detected: ${event.moveId} (${event.duration}ms)`);
        }
      },
      onPerformance: (event) => {
        console.log(`Performance: ${event.operation} took ${event.duration}ms`);
      }
    }
  }
});

// Calculate statistics
function getStats() {
  const avg = performanceMetrics.moves.reduce((a, b) => a + b, 0) / performanceMetrics.moves.length;
  const max = Math.max(...performanceMetrics.moves);
  const min = Math.min(...performanceMetrics.moves);
  
  return { avg, max, min, count: performanceMetrics.moves.length };
}
```

### Game Replay System

```typescript
const gameEvents: TelemetryEvent[] = [];

const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',  // Important for deterministic replay
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        gameEvents.push(event);
      },
      onStateChange: (event) => {
        gameEvents.push(event);
      }
    }
  }
});

// Replay game later
function replayGame(events: TelemetryEvent[]) {
  const replayEngine = new RuleEngine(gameDefinition, players, {
    seed: 'game-123',  // Same seed for determinism
    telemetry: { enabled: false }  // No telemetry during replay
  });
  
  for (const event of events) {
    if (event.type === 'playerAction') {
      replayEngine.executeMove(event.moveId, {
        playerId: event.playerId,
        params: event.params
      });
    }
  }
  
  return replayEngine.getState();
}
```

## Game Definition Integration

Register telemetry hooks directly in your game definition:

```typescript
const gameDefinition: GameDefinition<MyState, MyMoves> = {
  name: 'My TCG',
  setup: (players) => ({ /* ... */ }),
  moves: { /* ... */ },
  
  telemetryHooks: {
    onPlayerAction: (event) => {
      // Track player behavior
      playerStats[event.playerId].moveCount++;
      playerStats[event.playerId].totalDuration += event.duration;
    },
    onFlowTransition: (event) => {
      // Track game pacing
      if (event.transitionType === 'turn') {
        gameMetrics.averageTurnDuration = calculateAverage(turnDurations);
      }
    },
    onEngineError: (event) => {
      // Log errors for debugging
      console.error('Game error:', event);
    }
  }
};
```

## Best Practices

### 1. Enable in Production

Telemetry has minimal overhead and provides valuable insights:

```typescript
// ✅ Good - telemetry enabled
const engine = new RuleEngine(gameDefinition, players, {
  telemetry: { enabled: true }
});

// ❌ Bad - missing valuable data
const engine = new RuleEngine(gameDefinition, players, {
  telemetry: { enabled: false }
});
```

### 2. Sample High-Volume Events

For high-traffic games, sample events:

```typescript
let sampleRate = 0.1;  // 10% sampling

telemetry.registerHook('onPlayerAction', (event) => {
  if (Math.random() < sampleRate) {
    analytics.track('game.move', event);
  }
});
```

### 3. Async Handlers

Use async handlers for I/O operations:

```typescript
telemetry.registerHook('onStateChange', async (event) => {
  try {
    await database.savePatches(event.patches);
  } catch (error) {
    console.error('Failed to save patches:', error);
  }
});
```

### 4. Error Handling in Hooks

Always handle errors in telemetry hooks:

```typescript
// ✅ Good - error handling
telemetry.registerHook('onPlayerAction', (event) => {
  try {
    analytics.track('game.move', event);
  } catch (error) {
    console.error('Analytics error:', error);
    // Don't throw - telemetry errors shouldn't crash the game
  }
});

// ❌ Bad - no error handling
telemetry.registerHook('onPlayerAction', (event) => {
  analytics.track('game.move', event);  // Could throw
});
```

### 5. Use Type Guards

Use type narrowing for event-specific logic:

```typescript
telemetry.on('playerAction', (event) => {
  if (event.result === 'success') {
    // Handle success
    successMetrics.push(event.duration);
  } else {
    // Handle failure
    failureMetrics.push({
      moveId: event.moveId,
      error: event.error,
      errorCode: event.errorCode
    });
  }
});
```

## Performance Considerations

### Event Volume

Typical event volumes per game:
- **Small game (5 min)**: ~100-500 events
- **Medium game (20 min)**: ~500-2000 events
- **Large game (60 min)**: ~2000-10000 events

### Memory Usage

Each event: ~100-500 bytes depending on context size.
For a 20-minute game with 1000 events: ~100-500KB total.

### Processing Overhead

- Event emission: <1ms per event
- Hook execution: Depends on hook complexity
- Network calls: Use async to avoid blocking

### Recommendations

1. **Sampling**: Use sampling for high-volume production environments
2. **Batching**: Batch events before sending to analytics services
3. **Async**: Always use async for I/O operations
4. **Filtering**: Filter events at the source rather than in hooks

## FAQ

**Q: Does telemetry impact game performance?**  
A: Minimal impact (<1-2%). Disable if extreme performance is needed.

**Q: Can I add custom event types?**  
A: Not directly, but you can add custom data to event contexts or use the generic `metadata` fields.

**Q: How do I replay games?**  
A: Capture `PlayerActionEvent` events and replay with the same seed.

**Q: Can I use telemetry without hooks?**  
A: Yes, use the EventEmitter API: `telemetry.on('eventType', handler)`

**Q: What happens if a hook throws an error?**  
A: The error is caught and logged, but game execution continues.

**Q: Can I modify events in hooks?**  
A: No, events are read-only. Create new derived events if needed.

**Q: How do I test with telemetry?**  
A: Disable telemetry in tests or use mock hooks to verify events.

## See Also

- [Logging Guide](./LOGGING.md) - Structured logging system
- [Testing Guide](./guides/TESTING.md) - Testing with telemetry
- [API Reference](./README.md) - Full API documentation

