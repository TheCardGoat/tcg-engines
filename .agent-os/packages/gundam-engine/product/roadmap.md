# Product Roadmap

## Phase 1: Core Game Loop Implementation (Current Phase)

### Scope
Establish foundational gameplay structure and basic turn flow without complex mechanics.

### Deliverables
- [x] Package structure and configuration
- [x] TypeScript, Biome, and Turbo configuration
- [x] Turborepo boundaries enforcement
- [ ] Game state definition (GundamState type)
- [ ] Zone configurations (Hand, Deck, G-Zone, Junk Yard, Battle Area)
- [ ] Turn/phase/step flow (Set, Draw, Deploy, Battle, End)
- [ ] Basic moves: Deploy Unit, Pass Turn, Draw Card
- [ ] Setup and initialization functions
- [ ] Simple unit deployment without abilities
- [ ] Resource system (cost calculation and payment)

### Success Criteria
- Complete turn cycle playable end-to-end
- Units can be deployed to battle area
- Basic resource management functional
- Turn phases transition correctly
- Deterministic game state management
- Integration with RuleEngine successful
- Core mechanics tested with behavior tests

### Testing Focus
- Turn flow transitions
- Zone management
- Basic deployment rules
- Resource payment validation

---

## Phase 2: Keyword Effects & Basic Abilities

### Scope
Implement fundamental keyword abilities and simple triggered effects that don't require complex timing.

### Deliverables
- Keyword abilities: Double Attack, Intercept, Shield, Burst
- Simple triggered abilities (on deploy, on destroy)
- Ability registration system
- Basic effect resolution
- Ability validation and cost checking
- Static abilities (continuous effects)

### Success Criteria
- All basic keywords functional
- Simple triggered abilities work correctly
- Effect resolution deterministic
- Abilities properly validated
- No complex timing interactions yet

### Testing Focus
- Each keyword ability in isolation
- Simple ability chains
- Effect ordering for simple scenarios

---

## Phase 3: Complex Card Abilities & Effects

### Scope
Implement sophisticated card abilities with complex timing, targeting, and multi-step resolution.

### Deliverables
- Activated abilities with costs
- Complex triggered abilities (multiple conditions)
- Ability targeting system
- Replacement effects
- Priority and timing windows
- Effect stack management
- Counter abilities and responses
- Card draw and deck manipulation effects
- Search and tutor effects

### Success Criteria
- Complex abilities work correctly
- Proper timing and priority handling
- Multiple simultaneous triggers resolved correctly
- Targeting validation comprehensive
- Effect stack properly managed

### Testing Focus
- Complex ability interactions
- Priority passing scenarios
- Simultaneous triggers
- Response windows

---

## Phase 4: Card Set Implementations

### Scope
Define cards from official Gundam Card Game sets with all abilities and effects.

### Deliverables
- Booster Set 001 cards (initial release cards)
- Booster Set 002 cards
- Card ability DSL/builder patterns
- Card definition validation
- Comprehensive card tests
- Card database structure
- Set-specific mechanics

### Success Criteria
- All cards from target sets defined
- Complex card interactions working
- Card definitions type-safe
- Comprehensive ability coverage
- Cards match official text and rulings

### Testing Focus
- Individual card functionality
- Cross-card interactions
- Set-specific mechanics
- Edge cases for complex cards

---

## Phase 5: Advanced Mechanics

### Scope
Implement combat system, G-orders, and other advanced game mechanics.

### Deliverables
- **Combat System:**
  - Attack declaration and validation
  - Block declaration and assignment
  - Multi-block support
  - Damage assignment and resolution
  - Combat damage triggers
  - Combat state tracking
- **G-Order System:**
  - G-Zone management
  - G-Order deployment and timing
  - G-Order limit tracking
  - Special G-Order mechanics
- **Advanced Mechanics:**
  - Pilot cards and attachment
  - Position-based effects
  - Multi-zone card interactions
  - Chain abilities
  - Combo mechanics

### Success Criteria
- Full combat system functional
- All combat scenarios properly handled
- G-Orders work according to official rules
- Pilot attachment system complete
- Complex multi-card combos work
- All official mechanics implemented

### Testing Focus
- Combat resolution scenarios
- Multi-attacker/multi-blocker scenarios
- G-Order timing and limits
- Pilot attachment interactions
- Complex combo sequences

---

## Phase 6: Optimization & Production Readiness

### Scope
Performance optimization, comprehensive testing, and production hardening.

### Deliverables
- Performance profiling and optimization
- Memory usage optimization
- Move enumeration for AI support
- State evaluation functions
- Comprehensive documentation
- Example integrations
- Edge case handling
- Error recovery mechanisms
- Replay system validation
- API stabilization

### Success Criteria
- Performance suitable for real-time multiplayer
- Efficient combat resolution
- Memory usage optimized
- 100% test coverage maintained
- All edge cases handled
- Clear API documentation
- Reference examples available
- Production-ready quality
- No known critical bugs

### Testing Focus
- Performance benchmarks
- Stress testing with complex board states
- Edge case scenarios
- Integration testing
- Replay consistency

---

## Future Considerations

### Potential Additions
- **AI Support:** Pre-built evaluation functions for combat and card value
- **Simulation Tools:** Batch game simulation for deck testing
- **Rule Debugger:** Visual tool for understanding combat and ability resolution
- **Card DSL:** Higher-level language for defining complex card abilities
- **Performance Dashboard:** Real-time metrics for engine performance
- **Multiplayer Extensions:** Support for multiplayer formats beyond 2-player
- **Draft Mode:** Support for limited formats and draft mechanics
- **Deck Validation:** Pre-built deck validation rules
- **Official Rulings Database:** Integration with official card rulings

### Community Contributions
- Card set contributions from community
- Custom format definitions
- Additional game modes
- Performance improvements
- Bug reports and edge cases
- Translation support for card text

---

## Notes

- Roadmap is subject to change based on `@tcg/core` framework evolution
- Phases may overlap or be adjusted based on priorities
- Each phase builds incrementally on previous phases
- Combat system (Phase 5) is critical and may require framework enhancements
- Community feedback will influence feature prioritization
- Each phase includes comprehensive testing and documentation
- Focus on validating `@tcg/core` framework capabilities throughout
