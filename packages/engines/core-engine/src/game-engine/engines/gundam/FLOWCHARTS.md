# Gundam Card Game Flowcharts

These flowcharts illustrate the key game processes based on the Gundam Card Game Comprehensive Rules.

## Game Overview

```mermaid
graph TD
    A_Start[Game Setup] --> B_Turn[Turn Progression]

    subgraph "Game Setup (Section 5.2)"
        S1[Each player presents Deck (50 cards) and Resource Deck (10 cards)] --> S2
        S2{Decks conform to construction rules?} --> S3
        S3[Each player shuffles their Deck] --> S4
        S4[Place Decks: Deck in Deck Area (face down), Resource Deck in Resource Deck Area (face down)] --> S5
        S5[Determine Player One & Player Two (e.g., rock paper scissors)] --> S6
        S6[Each player draws 5 cards (Starting Hand)] --> S7
        S7[Player One decides to redraw hand (Mulligan)] --> S8
        S8{Redraw?} -- Yes --> S8a[Return hand to bottom of Deck, Draw 5 new cards, Shuffle Deck] --> S9
        S8 -- No --> S9
        S9[Player Two decides to redraw hand (Mulligan)] --> S10
        S10{Redraw?} -- Yes --> S10a[Return hand to bottom of Deck, Draw 5 new cards, Shuffle Deck] --> S11
        S10 -- No --> S11
        S11[Each player places top 6 cards from Deck to Shield Section (face down, one by one)] --> S12
        S12[Each player places 1 active EX Base token in Base Section of Shield Area] --> S13
        S13[Player Two places 1 active EX Resource token in their Resource Area] --> S14
        S14[Game begins with Player One's turn]
    end

    subgraph "Turn Progression (Section 6.1)"
        direction LR
        T_Start[Start of Turn] --> T_StartPhase[Start Phase]
        T_StartPhase --> T_DrawPhase[Draw Phase]
        T_DrawPhase --> T_ResourcePhase[Resource Phase]
        T_ResourcePhase --> T_MainPhase[Main Phase]
        T_MainPhase --> T_EndPhase[End Phase]
        T_EndPhase --> T_NextTurn[Pass Turn to Opponent]

        subgraph "Start Phase (6.2)"
            SP1[Active Step: Set all rested cards in Battle Area, Resource Area, Base Section to Active] --> SP2
            SP2[Start Step: "At the start of the turn" effects activate]
        end

        subgraph "Draw Phase (6.3)"
            DP1[Active player draws 1 card from Deck] --> DP2
            DP2{Deck empty after draw?} -- Yes --> DP_Lose[Player Loses Game]
            DP2 -- No --> DP_End[End Draw Phase]
        end

        subgraph "Resource Phase (6.4)"
            RP1[Active player places 1 Resource card from Resource Deck into Resource Area (face up, active)]
        end

        subgraph "Main Phase (6.5)"
            MP_Start[Start Main Phase] --> MP_Actions
            MP_Actions{Perform Action?} -- Yes --> MP_ChooseAction
            MP_ChooseAction[Choose Action:<br/>1. Play Card from Hand<br/>2. Activate [Activate Main] effect<br/>3. Attack with Unit<br/>4. Declare End of Main Phase] --> MP_Perform
            MP_Perform -- Play Card --> MP_PlayCard[See Play Card Flow] --> MP_Actions
            MP_Perform -- Activate Effect --> MP_ActivateMain[Activate [Activate Main] Effect] --> MP_Actions
            MP_Perform -- Attack --> MP_Attack[See Attack Sequence Flow] --> MP_Actions
            MP_Actions -- No / Declare End --> MP_EndMainPhase[End Main Phase]
            MP_Perform -- Declare End --> MP_EndMainPhase
        end

        subgraph "End Phase (6.6)"
            EP1[Action Step] --> EP1_Flow[See Action Step Flow] --> EP2
            EP2[End Step: "At the end of the turn" effects activate] --> EP3
            EP3[Hand Step: If hand > 10 cards, discard to 10] --> EP4
            EP4[Cleanup Step: "During this turn" effects lose effect. Resolve resulting triggers.]
        end
    end

## Play Card from Hand (Main Phase - 6.5.2)

```mermaid
graph TD
    subgraph "Play Card from Hand (Main Phase - 6.5.2)"
        direction LR
        PC_Start[Play Card from Hand] --> PC_ChooseType
        PC_ChooseType{Card Type?}
        PC_ChooseType -- Unit --> PC_Unit[Unit Deployment: Pay cost, deploy to Battle Area]
        PC_ChooseType -- Base --> PC_Base[Base Deployment: Pay cost, deploy to Base Section of Shield Area]
        PC_ChooseType -- Pilot --> PC_Pilot[Pilot Pairing: Pay cost, pair with Unit in Battle Area]
        PC_ChooseType -- Command (Main) --> PC_Command[Activate Command Card with [Main]: Pay cost, activate effect]
    end
```

## Attack Sequence (Section 7)

```mermaid
graph TD
    subgraph "Attack Sequence (Section 7)"
        AS_Start[Declare Attack: Select active Unit, Rest it, Declare Target (Opponent or Rested Enemy Unit)] --> AS_AttackStep
        AS_AttackStep[Attack Step] --> AS_TriggerAttackEffects
        AS_TriggerAttackEffects["[When Attacking]" effects & "when a unit attacks" effects trigger (Active Player resolves first, then Standby)] --> AS_ResolveNewTriggers
        AS_ResolveNewTriggers[Resolve any newly triggered effects] --> AS_DuringBattleEffects
        AS_DuringBattleEffects["During this battle" effects gain effect] --> AS_CheckMoved1
        AS_CheckMoved1{Attacker or Target moved/destroyed?} -- Yes --> AS_BattleEndStep
        AS_CheckMoved1 -- No --> AS_BlockStep

        AS_BlockStep[Block Step] --> AS_StandbyBlocker
        AS_StandbyBlocker{Standby player activates <Blocker> on an active Unit?} -- Yes --> AS_ChangeTarget[Change attack target to Blocker Unit] --> AS_ResolveBlockEffects
        AS_StandbyBlocker -- No --> AS_ResolveBlockEffects
        AS_ResolveBlockEffects[Resolve any effects] --> AS_CheckMoved2
        AS_CheckMoved2{Attacker or Target moved/destroyed?} -- Yes --> AS_BattleEndStep
        AS_CheckMoved2 -- No --> AS_ActionStepAttack

        AS_ActionStepAttack[Action Step (During Attack)] --> AS_ActionStepFlow[See Action Step Flow] --> AS_CheckMoved3
        AS_CheckMoved3{Attacker or Target moved/destroyed?} -- Yes --> AS_BattleEndStep
        AS_CheckMoved3 -- No --> AS_DamageStep

        AS_DamageStep[Damage Step: Confirm attack target] --> AS_TargetType
        AS_TargetType{Target is Player?} -- Yes --> AS_PlayerDamage
        AS_TargetType -- No (Target is Unit) --> AS_UnitDamage

        AS_PlayerDamage[Attack on Player] --> AS_CheckShieldArea
        AS_CheckShieldArea{Opponent has Base in Shield Area?} -- Yes --> AS_DamageBase["Attacking Unit deals AP to Base.<br/>(<First Strike> applies).<br/>Destroy Base if HP <= 0."] --> AS_ResolvePlayerEffects
        AS_CheckShieldArea -- No --> AS_CheckShields
        AS_CheckShields{Opponent has Shields (but no Base)?} -- Yes --> AS_DamageShield["Attacking Unit deals AP to top Shield.<br/>Destroy Shield, reveal, owner may activate [Burst]."] --> AS_ResolvePlayerEffects
        AS_CheckShields -- No (No Base, No Shields) --> AS_DamagePlayerDirectly["Attacking Unit deals AP to Player.<br/>If Player has no Shields, Player is defeated."] --> AS_ResolvePlayerEffects
        AS_ResolvePlayerEffects[Resolve all effects] --> AS_BattleEndStep

        AS_UnitDamage[Attack on Unit: Battle between Units] --> AS_DealDamageToUnits["Attacking Unit deals AP to Target Unit.<br/>Target Unit deals AP to Attacking Unit.<br/>(Simultaneously, <First Strike> applies).<br/>Destroy Unit(s) if HP <= 0."] --> AS_ResolveUnitEffects
        AS_ResolveUnitEffects[Resolve all effects] --> AS_BattleEndStep

        AS_BattleEndStep[Battle End Step] --> AS_LoseDuringBattleEffects["During this battle" effects lose effect] --> AS_ResolveEndBattleEffects
        AS_ResolveEndBattleEffects[Resolve any activated effects] --> AS_ReturnToMainPhase[Battle Ends, Return to Main Phase]
    end
```

## Action Step (Section 8)

```mermaid
graph TD
    subgraph "Action Step (Section 8)"
        direction TD
        Action_Start[Action Step Begins (Standby Player has priority)] --> Action_Loop
        Action_Loop -- Standby Player's Turn --> Action_SP_Choice[Standby Player: Activate [Action] Command, Activate [Activate Action] effect, or Pass]
        Action_SP_Choice -- Action Taken --> Action_Resolve_SP[Resolve Action] --> Action_AP_Turn
        Action_SP_Choice -- Pass --> Action_SP_Passed[Standby Player Passed] --> Action_AP_Turn

        Action_AP_Turn[Active Player's Turn] --> Action_AP_Choice[Active Player: Activate [Action] Command, Activate [Activate Action] effect, or Pass]
        Action_AP_Choice -- Action Taken --> Action_Resolve_AP[Resolve Action] --> Action_CheckPasses
        Action_AP_Choice -- Pass --> Action_AP_Passed[Active Player Passed] --> Action_CheckPasses

        Action_CheckPasses{Both players passed consecutively?} -- Yes --> Action_End[End Action Step]
        Action_CheckPasses -- No (Standby Player Passed, Active Player Acted) --> Action_Loop
        Action_CheckPasses -- No (Active Player Passed, Standby Player Acted) --> Action_Loop
        Action_CheckPasses -- No (Neither Passed / Only one passed before other acted) --> Action_Loop
    end
```
```
