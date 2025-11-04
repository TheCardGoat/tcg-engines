# Lorcana Engine — Components Diagram

A high-level map of the `lorcana-engine` package for new contributors. It shows major components and how they interact. Use it to find the right home for new code (moves, abilities, operations, etc.).

```mermaid
%%{init: {'flowchart': {'rankSpacing': 40, 'nodeSpacing': 20}}}%%
flowchart LR
  %% Base dependency
  CORE["<b>@tcg/core - Core Engine</b><br/>(core-engine package)<br/><br/>• GameEngine & CoreOperation<br/>• Zone & Card operations<br/>• Flow manager (segments/turns/phases)<br/>• Immer-based state updates"]

  %% Foundation Layer
  subgraph FOUNDATION["🔷 Foundation Layer"]
    direction TB
    TYPES["<b>Types</b><br/>📁 lorcana-engine-types.ts<br/>📁 cards/lorcana-card-types.ts"]
    CARDS["<b><a href='#card-system'>Card System</a></b><br/>📁 cards/**<br/>• LorcanaCardInstance<br/>• CardRepository<br/>• CardFilterBuilder"]
    ABILITIES["<b><a href='#abilities-system'>Abilities</a></b><br/>📁 abilities/**<br/>• Activated/Triggered/Static<br/>• Keywords & Replacements<br/>• Targets & Effects"]
    
    TYPES --> CARDS
    TYPES --> ABILITIES
    CARDS --> ABILITIES
  end

  %% Game Logic Layer
  subgraph LOGIC["🎮 Game Logic Layer"]
    direction TB
    OPS["<b><a href='#lorcanacoreoperations'>LorcanaCoreOperations</a></b><br/>📁 operations/**<br/>• Quest/Challenge logic<br/>• Ink management<br/>• Ability resolution (the Bag)<br/>• Game state checks"]
    OPS_MOD["<b><a href='#operations-modules'>Operation Modules</a></b><br/>📁 operations/modules/**<br/>• challenge-character<br/>• quest-with-character<br/>• add-abilities-to-resolve<br/>• ready-all-characters"]
    
    OPS --> OPS_MOD
  end

  %% Player Actions Layer
  subgraph ACTIONS["🎯 Player Actions & Flow"]
    direction TB
    MOVES["<b><a href='#moves'>Moves</a></b><br/>📁 moves/**<br/>• playCard, quest, challenge<br/>• sing, singTogether<br/>• putACardIntoTheInkwell<br/>• useActivatedAbility"]
    SEGMENTS["<b><a href='#segments'>Segments</a></b><br/>📁 game-definition/segments/**<br/>• startingAGame<br/>• duringGame (phases/steps)<br/>• endGame"]
    GAMEDEF["<b><a href='#game-definition'>Game Definition</a></b><br/>📄 lorcana-game-definition.ts<br/>• Bundles segments & moves"]
    
    MOVES --> SEGMENTS
    SEGMENTS --> GAMEDEF
  end

  %% Top Layer
  subgraph TOP["🚀 Engine & Testing"]
    direction TB
    ENGINE["<b><a href='#lorcanaengine'>LorcanaEngine</a></b><br/>📄 lorcana-engine.ts<br/>• Main engine class<br/>• Uses LorcanaCoreOperations<br/>• External API located here"]
    TESTING["<b>Testing</b><br/>📁 testing/**<br/>• Test engine & mocks"]
    
    ENGINE --> TESTING
  end

  %% Cross-subgraph Dependencies (showing which subgraphs call functions in others)
  CORE --> FOUNDATION
  CORE --> LOGIC
  CORE --> ACTIONS
  CORE --> TOP
  
  %% Foundation provides types/cards/abilities to other layers
  TYPES --> OPS
  CARDS --> TOP
  ABILITIES --> OPS
  
  %% Actions call Logic (Moves and Segments call coreOps methods)
  ACTIONS --> LOGIC
  
  %% Engine uses GameDefinition and calls Logic
  GAMEDEF --> TOP
  LOGIC   --> TOP

  %% Styling
  classDef leftAlign text-align:left;
  classDef subgraphStyle fill:#1a1a1a,stroke:#666,stroke-width:2px;
  class CORE,TYPES,CARDS,ABILITIES,OPS,OPS_MOD,MOVES,SEGMENTS,GAMEDEF,ENGINE,TESTING leftAlign;
  class FOUNDATION,LOGIC,ACTIONS,TOP subgraphStyle;
```

## Glossary

### LorcanaEngine
**What:** The main engine class that extends `GameEngine` from core-engine. Provides Lorcana-specific functionality.  
**Where:** `src/lorcana-engine.ts`  
**Key Features:**
- Initializes `LorcanaCardInstance` models for all cards
- Uses `LorcanaCoreOperations` for game logic
- Provides game-specific API for querying moves and state

### LorcanaCoreOperations
**What:** Extension of `CoreOperation` from core-engine. Encapsulates all Lorcana-specific game logic and rules.  
**Where:** `src/operations/lorcana-core-operations.ts`  
**Key Responsibilities:**
- Character questing and challenging logic
- Ink management (ready, exert, calculate available)
- Ability resolution via "the Bag" (triggered effects queue)
- Location operations (enter/leave)
- Game state checks and win conditions
- Delegates complex operations to modules in `operations/modules/`

### Operations Modules
**What:** Complex operations (>5 lines) extracted to separate files for maintainability and testability.  
**Where:** `src/operations/modules/`  
**Examples:**
- `challenge-character.ts` — handles challenge resolution, damage, banishing
- `quest-with-character.ts` — validates and resolves questing
- `add-abilities-to-resolve.ts` — adds triggered abilities to the Bag
- `resolve-layer-item.ts` — resolves a single triggered ability from the Bag
- `ready-all-characters.ts` — readies all characters for a player
- `exert-ink-for-cost.ts` — exerts ink cards to pay costs

### Moves
**What:** Player actions that can be taken during the game. Each move is a function that validates conditions and modifies state.  
**Where:** `src/moves/` (organized by category)  
**Categories:**
- **Core gameplay:** `playCard`, `quest`, `challenge`
- **Resources:** `putACardIntoTheInkwell`
- **Songs:** `sing`, `singTogether`
- **Locations:** `moveCharacterToLocation`
- **Abilities:** `useActivatedAbility`
- **Setup:** `chooseFirstPlayer`, `alterHand`
- **Flow:** `passTurn`, `resolveBag`
- **Debug/Admin:** `concede`, `manualMoves`

All moves are exported from `moves.ts` as `lorcanaMoves`.

### Segments
**What:** Top-level game flow structure from core-engine. Segments contain turns, phases, and steps.  
**Where:** `src/game-definition/segments/`  
**Three Main Segments:**
- `startingAGame` — handles game setup (choose first player, draw, mulligan)
- `duringGame` — main gameplay loop with turn structure:
  - `beginningPhase` → `readyStep`, `setStep`, `drawStep`
  - `mainPhase` → where most moves happen
- `endGame` — win condition check

### Abilities System
**What:** Comprehensive ability framework for card effects.  
**Where:** `src/abilities/`  
**Ability Types:**
- **Activated:** Abilities with costs that can be manually triggered (`activated/`)
- **Triggered:** When/Whenever/At abilities that automatically trigger (`triggered/`, `whenAbilities.ts`, `wheneverAbilities.ts`, `atTheAbilities.ts`)
- **Static:** Continuous effects that apply while a card is in play (`static/`, `whileAbilities.ts`)
- **Keyword:** Simplified abilities like Rush, Evasive, Challenger (`keyword/`)
- **Replacement:** Effects that replace game events (`replacement/`)

Each ability has:
- **Conditions:** When it can trigger/activate
- **Targets:** What it affects
- **Effects:** What it does
- **Duration:** How long effects last

### The Bag (Layer Resolution)
**What:** A conceptual queue for triggered abilities waiting to resolve. When multiple effects trigger simultaneously, they're added to "the Bag" and resolved one at a time.  
**Where:** Managed by `LorcanaCoreOperations`  
**Key Operations:**
- `addAbilitiesToResolve()` — adds triggered abilities to the Bag
- `resolveLayerItem()` — resolves one ability from the Bag
- `resolveBag` move — player action to resolve pending abilities

### Card System
**What:** Lorcana-specific card implementation.  
**Where:** `src/cards/`  
**Key Classes:**
- `LorcanaCardInstance` — extends `CoreCardInstance` with Lorcana-specific functionality
- `LorcanaCardRepository` — manages card definitions and lookups
- `LorcanaCardFilterBuilder` — builds queries to find specific cards

### Game Definition
**What:** The complete rules configuration object passed to GameEngine. Defines the game structure.  
**Where:** `src/game-definition/lorcana-game-definition.ts` (exports `lorcanaGameDefinition` and `LorcanaGame`)  
**Contains:**
- Segments (game flow structure)
- Base moves (minimal set, most are in segments)
- Setup function
- Game metadata (name, player count)

---

## Where to add new code

- **New move:** Add to appropriate file in `src/moves/` (or create new file) and export from `src/moves/moves.ts`. Then reference in the appropriate segment phase/step in `src/game-definition/segments/`.

- **New ability type/logic:** Add to `src/abilities/` in the appropriate subdirectory:
  - `activated/` for activated abilities
  - `triggered/` for triggered abilities
  - `static/` for static/continuous effects
  - `keyword/` for keyword abilities
  - `replacement/` for replacement effects
  - Update ability types in `ability-types.ts`

- **New operation (game logic):** 
  - If simple (<5 lines): Add directly to `src/operations/lorcana-core-operations.ts`
  - If complex (>5 lines): Create a new module in `src/operations/modules/` and import/use it from `lorcana-core-operations.ts`

- **New segment/phase/step:** Modify the appropriate segment config in `src/game-definition/segments/`:
  - `starting-a-game/` for setup flow
  - `during-game/` for main game turn structure
  - `end-game/` for win condition logic

- **New card type or card logic:** Update `src/cards/`:
  - Card types in `lorcana-card-types.ts`
  - Card instance behavior in `lorcana-card-instance.ts`
  - Card definitions in `cards/definitions/`

- **Game setup/initialization:** Update `src/game-definition/segments/starting-a-game/starting-a-game-segment.ts`

- **Engine UX (AI/UI helpers):** Extend `src/lorcana-engine.ts` with new public methods for querying state or available actions

- **Tests:** 
  - Use `src/testing/lorcana-test-engine.ts` to arrange board state and execute moves
  - Add test files alongside the code being tested (e.g., `quest.test.ts` next to `quest.ts`)

- **Type definitions:** Add to:
  - `src/lorcana-engine-types.ts` for game state and player state types
  - `src/cards/lorcana-card-types.ts` for card-specific types
  - `src/moves/types.ts` for move parameter types

## Notes

- The engine extends `GameEngine` from `@tcg/core` core-engine package
- `LorcanaCoreOperations` extends `CoreOperation` and contains all Lorcana-specific game logic
- Game flow is defined using segments/turns/phases/steps from core-engine
- Complex operations (>5 lines) must be extracted to modules for maintainability
- The "Bag" (triggered abilities queue) is managed by `LorcanaCoreOperations`
- Card abilities are defined using the comprehensive abilities system in `src/abilities/`
- Keep TypeScript strict and avoid `any`. Prefer explicit Lorcana types
- **No validators directory exists** — validation logic is embedded in moves or operations
