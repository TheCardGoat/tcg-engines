# Logging System

Production-grade structured logging for `@tcg/core` with configurable verbosity levels and zero-overhead SILENT mode.

## Overview

The logging system provides:
- **Structured Logging**: Rich context with every log entry
- **Verbosity Levels**: 4 presets for different audiences
- **Zero Overhead**: SILENT mode has no performance impact
- **Child Loggers**: Namespace isolation for subsystems
- **Pretty Printing**: Human-readable output for development

## Quick Start

```typescript
import { RuleEngine } from '@tcg/core';

const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',
  logger: {
    level: 'DEVELOPER',  // or SILENT, NORMAL_PLAYER, ADVANCED_PLAYER
    pretty: true
  }
});
```

## Verbosity Levels

### SILENT (Level 0)
**Use Case**: Production deployments  
**Output**: None  
**Performance**: Zero overhead - all logging calls are no-ops

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'SILENT' }
});
```

### NORMAL_PLAYER (INFO - Level 3)
**Use Case**: Players who want to see basic game events  
**Output**: Move execution, phase transitions, game end

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'NORMAL_PLAYER', pretty: true }
});

// Example output:
// [INFO] Executing move: playCard (Player: player-1)
// [INFO] Phase transition (from: main, to: combat, Turn: 1)
// [INFO] Turn transition (turn: 1, nextTurn: 2)
```

### ADVANCED_PLAYER (DEBUG - Level 4)
**Use Case**: Players who want detailed game mechanics  
**Output**: Everything from NORMAL_PLAYER plus:
- Move condition evaluations
- Rule evaluations
- Move completion timing

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'ADVANCED_PLAYER', pretty: true }
});

// Example output:
// [INFO] Executing move: playCard (Player: player-1, params: {cardId: "card-42"})
// [DEBUG] Evaluating move condition: playCard (Player: player-1)
// [DEBUG] Move completed: playCard (duration: 15ms, patches: 3)
// [INFO] Phase transition (from: main, to: combat, Turn: 1)
```

### DEVELOPER (TRACE - Level 5)
**Use Case**: Developers debugging the engine  
**Output**: Everything from ADVANCED_PLAYER plus:
- Condition pass/fail details
- Operations (zone, card, game) at TRACE level
- Full error stacks
- Detailed context

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'DEVELOPER', pretty: true }
});

// Example output:
// [INFO] Executing move: playCard (Player: player-1, params: {cardId: "card-42"})
// [DEBUG] Evaluating move condition: playCard (Player: player-1)
// [TRACE] Condition passed: playCard
// [TRACE] [zones] Moving card (cardId: card-42, targetZone: play, position: bottom)
// [TRACE] [cards] Updating card meta (cardId: card-42, updates: {tapped: false})
// [DEBUG] Move completed: playCard (duration: 15ms, patches: 3)
```

## Using the Logger

### Get Logger Instance

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'DEVELOPER' }
});

const logger = engine.getLogger();
logger.info('Custom game event', { customData: 123 });
```

### Child Loggers

Create isolated loggers for subsystems:

```typescript
const logger = engine.getLogger();

// Create child logger with namespace
const aiLogger = logger.child('ai');
aiLogger.info('Evaluating move options', { count: 12 });
// Output: [INFO] [ai] Evaluating move options (count: 12)

const uiLogger = logger.child('ui');
uiLogger.debug('Rendering game board', { cards: 20 });
// Output: [DEBUG] [ui] Rendering game board (cards: 20)
```

### Log Methods

```typescript
// ERROR level - Critical errors
logger.error('Move execution failed', {
  moveId: 'playCard',
  error: 'Invalid card ID',
  stack: error.stack
});

// WARN level - Warnings and failed conditions
logger.warn('Move condition failed', {
  moveId: 'playCard',
  reason: 'Not enough mana'
});

// INFO level - Important game events
logger.info('Game started', {
  players: 2,
  seed: 'game-123'
});

// DEBUG level - Detailed debugging
logger.debug('Move validated', {
  moveId: 'playCard',
  duration: 5
});

// TRACE level - Fine-grained details
logger.trace('Checking card property', {
  cardId: 'card-42',
  property: 'canAttack'
});
```

## Structured Context

All log methods accept a context object with structured data:

```typescript
type LogContext = {
  moveId?: string;
  playerId?: string;
  phase?: string;
  segment?: string;
  turn?: number;
  timestamp?: number;
  error?: string;
  stack?: string;
  errorCode?: string;
  duration?: number;
  patchCount?: number;
  [key: string]: unknown;  // Custom fields
};

logger.info('Move executed', {
  moveId: 'playCard',
  playerId: 'player-1',
  phase: 'main',
  turn: 1,
  duration: 15,
  patchCount: 3,
  // Custom fields
  cardType: 'creature',
  manaCost: 3
});
```

## Configuration Options

```typescript
type LoggerOptions = {
  // Verbosity level (preset or numeric)
  level?: 'SILENT' | 'NORMAL_PLAYER' | 'ADVANCED_PLAYER' | 'DEVELOPER' | LogLevel;
  
  // Pretty print for humans (default: true)
  pretty?: boolean;
  
  // Output destination (default: process.stdout)
  destination?: WritableStream;
};

// Example configurations
const devConfig: LoggerOptions = {
  level: 'DEVELOPER',
  pretty: true
};

const prodConfig: LoggerOptions = {
  level: 'SILENT'
};

const fileConfig: LoggerOptions = {
  level: 'INFO',
  pretty: false,  // JSON for parsing
  destination: fs.createWriteStream('game.log')
};
```

## Integration with Engine

The logging system is integrated throughout the engine:

### RuleEngine
- Move execution start/end (INFO)
- Condition evaluation (DEBUG)
- Condition results (TRACE)
- Errors and failures (ERROR, WARN)

### FlowManager
- Phase transitions (INFO)
- Turn transitions (INFO)
- Segment transitions (INFO)
- Lifecycle hooks (DEBUG)

### Operations
- Zone operations (TRACE)
- Card operations (TRACE)
- Game operations (TRACE)

## Performance

### Zero-Overhead SILENT Mode

When `level: 'SILENT'`, the logger becomes a no-op:
- No Pino instance created
- All log methods return immediately
- Zero CPU and memory overhead
- Safe for production use

```typescript
// Production configuration - zero overhead
const engine = new RuleEngine(gameDefinition, players, {
  logger: { level: 'SILENT' }
});
```

### Benchmarks

Logging performance (per 1000 operations):
- **SILENT**: <0.1ms (no-op)
- **INFO (pretty: false)**: ~2ms
- **DEBUG (pretty: false)**: ~5ms
- **TRACE (pretty: false)**: ~15ms
- **TRACE (pretty: true)**: ~50ms

**Recommendation**: Use SILENT in production, DEVELOPER in development.

## Best Practices

### 1. Use Appropriate Levels

```typescript
// ✅ Good - INFO for important events
logger.info('Game started', { players: 2 });

// ❌ Bad - TRACE for important events
logger.trace('Game started', { players: 2 });

// ✅ Good - TRACE for internal details
logger.trace('Checking card property', { cardId, property });

// ❌ Bad - INFO for internal details
logger.info('Checking card property', { cardId, property });
```

### 2. Include Rich Context

```typescript
// ✅ Good - rich context
logger.info('Move executed', {
  moveId: 'playCard',
  playerId: 'player-1',
  duration: 15,
  patchCount: 3
});

// ❌ Bad - missing context
logger.info('Move executed');
```

### 3. Use Child Loggers

```typescript
// ✅ Good - namespaced loggers
const aiLogger = engine.getLogger().child('ai');
const uiLogger = engine.getLogger().child('ui');

aiLogger.info('AI thinking', { depth: 3 });
uiLogger.info('Rendering board', { cards: 20 });

// ❌ Bad - mixing concerns
const logger = engine.getLogger();
logger.info('[AI] AI thinking', { depth: 3 });
logger.info('[UI] Rendering board', { cards: 20 });
```

### 4. Log Errors Completely

```typescript
// ✅ Good - full error details
try {
  // ...
} catch (error) {
  logger.error('Operation failed', {
    operation: 'playCard',
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { cardId, playerId }
  });
}

// ❌ Bad - incomplete error
logger.error('Operation failed');
```

## Examples

### Basic Game Logging

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',
  logger: {
    level: 'NORMAL_PLAYER',
    pretty: true
  }
});

// Game automatically logs:
// - Move execution
// - Phase/turn transitions
// - Errors

engine.executeMove('playCard', {
  playerId: 'player-1',
  params: { cardId: 'card-42' }
});
```

### Custom Game Logging

```typescript
const logger = engine.getLogger();

// Log custom game events
logger.info('Deck shuffled', {
  playerId: 'player-1',
  cards: 40
});

logger.info('Card drawn', {
  playerId: 'player-1',
  cardId: 'card-7',
  handSize: 6
});
```

### Development Debugging

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  logger: {
    level: 'DEVELOPER',
    pretty: true
  }
});

// Trace level shows everything:
// [INFO] Executing move: playCard
// [DEBUG] Evaluating move condition: playCard
// [TRACE] Condition passed: playCard
// [TRACE] [zones] Moving card (cardId: card-42, ...)
// [TRACE] [cards] Updating card meta (cardId: card-42, ...)
// [DEBUG] Move completed: playCard (duration: 15ms)
```

## FAQ

**Q: Does logging impact performance?**  
A: SILENT mode has zero overhead. Other levels have minimal impact (<5% for most games).

**Q: Can I log to a file?**  
A: Yes, provide a `destination` stream:
```typescript
logger: {
  level: 'INFO',
  pretty: false,
  destination: fs.createWriteStream('game.log')
}
```

**Q: Can I use a different logger (Winston, Bunyan)?**  
A: The Logger class wraps Pino but you can create custom loggers implementing the same interface.

**Q: How do I filter logs by namespace?**  
A: Use Pino's filtering or grep the output:
```bash
npm start | grep '\[ai\]'
```

**Q: Can I change log level at runtime?**  
A: No, log level is set at engine initialization. Create a new engine instance to change levels.

## See Also

- [Telemetry Guide](./TELEMETRY.md) - Event-based telemetry system
- [Testing Guide](./guides/TESTING.md) - Testing with logs
- [API Reference](./README.md) - Full API documentation

