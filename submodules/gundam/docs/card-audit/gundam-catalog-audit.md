# Gundam Catalog Fidelity and Behavioral Coverage Audit

Generated: 2026-07-29T18:57:52.353Z

## Printing parity

- Official unique printings: 1777
- Runtime unique printings: 1777
- Missing official printings: 0
- Extra runtime printings: 0
- Canonical cards: 1055 (1120 authored definitions; 63 duplicate-owner groups).

## Effect fidelity

- Total fidelity exceptions: 0
- Structure matches parser: 736
- No behavior required: 319
- Printed-text mismatches: 0
- Parser-unparsed: 0
- Parser fallbacks: 0
- Parser/runtime mismatches: 0

## Behavioral coverage

- Behavioral review queue: 0
- Behavioral proof present: 736
- Partial behavioral coverage: 0
- Behavioral test missing: 0
- Missing test files: 0
- Runtime fallback/unparsed cards: 22
- Meaningful runtime fallback/unparsed cards: 0
- Untested meaningful runtime fallback cards: 0
- No behavior required: 319
- Verified harness blockers: 4

## Verified harness blockers

- EB01-040 Gundam Epyon: GundamTestEngine fixture creation currently seeds two players; this card requires two or more enemy players for its executable branch.
- EB01-044 Justice Gundam (EX): GundamTestEngine fixture creation currently seeds two players; this card requires two or more enemy players for its executable branch.
- EB01-055 Dom Gross Beil: GundamTestEngine fixture creation currently seeds two players; this card requires two or more enemy players for its executable branch.
- EB01-058 Extreme Gundam: GundamTestEngine fixture creation currently seeds two players; this card requires two or more enemy players for its executable branch.

## Fidelity mismatches

| Card | Status | Source | Printed clause | Parsed clause | Runtime clause |
| ---- | ------ | ------ | -------------- | ------------- | -------------- |

## Behavioral review queue (risk ordered)

| Card | Risk | Fidelity | Coverage | Source | Test |
| ---- | ---: | -------- | -------- | ------ | ---- |

The JSON companion contains full, untruncated printed, parsed, and runtime clauses for every canonical card. A fixture is only marked `behavioral_test_present` when it is in the strict harness inventory and still contains a public `GundamTestEngine` action; ordinary test-file presence is reported as partial coverage.
