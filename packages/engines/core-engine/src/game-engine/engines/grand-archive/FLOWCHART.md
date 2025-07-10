# Grand Archive Game Flow Diagrams

This document visualizes the flow structures of Grand Archive's core game mechanics using MermaidJS diagrams. These diagrams can be used to implement state machines for controlling game execution flow.

## Table of Contents
1. [Turn Structure](#turn-structure)
2. [Priority System and Effects Stack](#priority-system-and-effects-stack)
3. [Card Activation Process](#card-activation-process)
4. [Card Materialization Process](#card-materialization-process)
5. [Combat Process](#combat-process)

## Turn Structure

```mermaid
stateDiagram-v2
    [*] --> WakeUpPhase
    WakeUpPhase --> MaterializePhase: All objects awakened
    MaterializePhase --> RecollectionPhase: After materialization
    RecollectionPhase --> DrawPhase: After recollection + opportunity passes
    DrawPhase --> MainPhase: After drawing one card
    MainPhase --> EndPhase: Player declares end of turn
    EndPhase --> [*]: Turn ends, next player begins
    
    WakeUpPhase: Wake Up Phase
    WakeUpPhase: - Awaken all rested objects

    MaterializePhase: Materialize Phase
    MaterializePhase: - Materialize one card from Material Deck

    RecollectionPhase: Recollection Phase
    RecollectionPhase: - Return cards from Memory to Hand
    RecollectionPhase: - Turn player gets Opportunity

    DrawPhase: Draw Phase
    DrawPhase: - Draw one card

    MainPhase: Main Phase
    MainPhase: - Play cards (slow speed)
    MainPhase: - Activate cards/abilities
    MainPhase: - Attack with units
    MainPhase: - Turn player gets Opportunity

    EndPhase: End Phase
    EndPhase: - End-of-turn effects resolve
    EndPhase: - Clear temporary damage
    EndPhase: - Turn player gets Opportunity
```

## Priority System and Effects Stack

```mermaid
flowchart TD
    A[Effect/Action] --> B[Place on Effects Stack]
    B --> C[Grant Opportunity]
    
    C --> D{Turn Player\nWants to Act?}
    D -- Yes --> E[Turn Player\nActivates Fast-speed Card/Ability]
    D -- No --> F{Non-Turn Player\nWants to Act?}
    
    E --> G[New Effect Added to Stack]
    G --> C
    
    F -- Yes --> H[Non-Turn Player\nActivates Fast-speed Card/Ability]
    F -- No --> I[All Players Pass]
    
    H --> J[New Effect Added to Stack]
    J --> C
    
    I --> K[Resolve Top Effect on Stack]
    K --> L{Stack Empty?}
    L -- No --> C
    L -- Yes --> M[Continue Game Flow]
```

## Card Activation Process

```mermaid
flowchart TD
    A[Announce Activation] --> B[Check Elements]
    B --> C[Declare Costs]
    C --> D[Select Modes]
    D --> E[Declare Targets]
    E --> F[Check Legality]
    F --> G[Calculate Reserve Cost]
    G --> H[Pay Costs]
    H --> I[Place on Effects Stack]
    I --> J[Grant Opportunity]
    J --> K[Resolve When All Players Pass]
```

## Card Materialization Process

```mermaid
flowchart TD
    A[Announce Materialization] --> B[Check Elements]
    B --> C[Declare Costs]
    C --> D[Select Modes]
    D --> E[Declare Targets]
    E --> F[Check Legality/Leveling Requirements]
    F --> G[Calculate Memory Cost]
    G --> H[Pay Costs]
    H --> I[Place on Effects Stack]
    I --> J[Grant Opportunity]
    J --> K[Resolve When All Players Pass]
```

## Combat Process

```mermaid
stateDiagram-v2
    [*] --> AttackDeclaration
    AttackDeclaration --> RetaliationStep: Attack declared
    RetaliationStep --> DamageStep: After all players pass Opportunity
    DamageStep --> EndOfCombat: After damage is dealt
    EndOfCombat --> [*]: Return to Main Phase
    
    AttackDeclaration: Attack Declaration
    AttackDeclaration: - Declare attacking unit & attack target
    AttackDeclaration: - Unit rests as cost
    AttackDeclaration: - On Attack triggers placed on Effects Stack
    
    RetaliationStep: Retaliation Step
    RetaliationStep: - Turn player gets Opportunity
    RetaliationStep: - Defending player may rest units to retaliate
    RetaliationStep: - All players get Opportunity
    
    DamageStep: Damage Step
    DamageStep: - Turn player gets Opportunity
    DamageStep: - Damage dealt simultaneously
    DamageStep: - Weapon loses durability
    DamageStep: - On Hit/On Kill triggers added to Effects Stack
    
    EndOfCombat: End of Combat
    EndOfCombat: - Cards in Intent go to graveyard
    EndOfCombat: - Attacking/defending roles cleared
    EndOfCombat: - State-based effects checked
```

## Effects Resolution System

```mermaid
flowchart TD
    A[Trigger Condition Met] --> B[Add to Effects Stack]
    B --> C{Multiple Triggers\nSame Time?}
    
    C -- Yes --> D[Turn Player's\nTriggers First]
    C -- No --> G
    
    D --> E[Non-Turn Player's\nTriggers Next]
    E --> F[Stack Complete]
    F --> G
    
    G[Grant Opportunity] --> H{All Players\nPass?}
    H -- No --> I[Player Activates\nFast-Speed Card/Ability]
    I --> J[New Effect\nAdded to Stack]
    J --> G
    
    H -- Yes --> K[Resolve Top\nEffect on Stack]
    K --> L{Stack Empty?}
    L -- No --> G
    L -- Yes --> M[Continue\nGame Flow]
```

## Continuous Effects and Layers

```mermaid
flowchart LR
    A[Continuous Effects] --> B{Apply in Layers}
    B --> C[Layer 1: Copy Effects]
    C --> D[Layer 2: Text-changing Effects]
    D --> E[Layer 3: Type-changing Effects]
    E --> F[Layer 4: Text-removing Effects]
    F --> G[Layer 5: Rule-modifying Effects]
    G --> H[Layer 6: Value-modifying Effects]
    H --> I[Final Modified Game State]
```

## State-Based Effects Check

```mermaid
flowchart TD
    A[Game State Check] --> B{Unit Damage ≥ Life?}
    B -- Yes --> C[Unit Dies]
    B -- No --> D{Weapon at 0 Durability?}
    
    C --> H
    
    D -- Yes --> E[Weapon Destroyed]
    D -- No --> F{Unique Rule Violated?}
    
    E --> H
    
    F -- Yes --> G[Force Sacrifice]
    F -- No --> H{Champion Dead or\nDeck Empty?}
    
    G --> H
    
    H -- Yes --> I[Game Ends]
    H -- No --> J[Continue Game]
```