import { describe, expect, it } from "bun:test";
import type { Result } from "../shared/result";
import type { CardInstance } from "./card-position";
import {
	type CardPosition,
	type CardPositionError,
	activateCard,
	canActivateCard,
	canRestCard,
	getCardPosition,
	isCardActive,
	isCardRested,
	restCard,
} from "./card-position";

describe("Card Position System", () => {
	const createTestCard = (
		overrides: Partial<CardInstance> = {},
	): CardInstance => ({
		id: "card1",
		cardType: "Unit",
		position: "active",
		zone: "battleArea",
		ownerId: "player1",
		...overrides,
	});

	describe("Position state queries", () => {
		describe("getCardPosition", () => {
			it("returns active for card in active position", () => {
				const card = createTestCard({ position: "active" });
				expect(getCardPosition(card)).toBe("active");
			});

			it("returns rested for card in rested position", () => {
				const card = createTestCard({ position: "rested" });
				expect(getCardPosition(card)).toBe("rested");
			});
		});

		describe("isCardActive", () => {
			it("returns true for active card", () => {
				const card = createTestCard({ position: "active" });
				expect(isCardActive(card)).toBe(true);
			});

			it("returns false for rested card", () => {
				const card = createTestCard({ position: "rested" });
				expect(isCardActive(card)).toBe(false);
			});
		});

		describe("isCardRested", () => {
			it("returns true for rested card", () => {
				const card = createTestCard({ position: "rested" });
				expect(isCardRested(card)).toBe(true);
			});

			it("returns false for active card", () => {
				const card = createTestCard({ position: "active" });
				expect(isCardRested(card)).toBe(false);
			});
		});
	});

	describe("Position transitions with Result types", () => {
		describe("restCard", () => {
			it("returns success when resting active card", () => {
				const card = createTestCard({ position: "active" });
				const result = restCard(card);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.position).toBe("rested");
				}
			});

			it("returns error when card is already rested (Rule 1-3-2-1)", () => {
				const card = createTestCard({ position: "rested" });
				const result = restCard(card);

				if (result.success) throw new Error("Expected error result");
				expect(result.success).toBe(false);
				expect(result.error.type).toBe("alreadyInPosition");
				expect(result.error.currentPosition).toBe("rested");
				expect(result.error.targetPosition).toBe("rested");
			});

			it("creates new object maintaining immutability", () => {
				const card = createTestCard({ position: "active" });
				const originalPosition = card.position;

				const result = restCard(card);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data).not.toBe(card);
					expect(card.position).toBe(originalPosition);
					expect(result.data.position).toBe("rested");
				}
			});
		});

		describe("activateCard", () => {
			it("returns success when activating rested card", () => {
				const card = createTestCard({ position: "rested" });
				const result = activateCard(card);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.position).toBe("active");
				}
			});

			it("returns error when card is already active (Rule 1-3-2-1)", () => {
				const card = createTestCard({ position: "active" });
				const result = activateCard(card);

				if (result.success) throw new Error("Expected error result");
				expect(result.success).toBe(false);
				expect(result.error.type).toBe("alreadyInPosition");
				expect(result.error.currentPosition).toBe("active");
				expect(result.error.targetPosition).toBe("active");
			});

			it("creates new object maintaining immutability", () => {
				const card = createTestCard({ position: "rested" });
				const originalPosition = card.position;

				const result = activateCard(card);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data).not.toBe(card);
					expect(card.position).toBe(originalPosition);
					expect(result.data.position).toBe("active");
				}
			});
		});
	});

	describe("Position validation rules", () => {
		describe("canRestCard", () => {
			it("returns true when card is active", () => {
				const card = createTestCard({ position: "active" });
				expect(canRestCard(card)).toBe(true);
			});

			it("returns false when card is already rested", () => {
				const card = createTestCard({ position: "rested" });
				expect(canRestCard(card)).toBe(false);
			});

			it("returns true for Units in battle area", () => {
				const card = createTestCard({
					position: "active",
					zone: "battleArea",
					cardType: "Unit",
				});
				expect(canRestCard(card)).toBe(true);
			});

			it("returns true for Resources in resource area", () => {
				const card = createTestCard({
					position: "active",
					zone: "resourceArea",
					cardType: "Resource",
				});
				expect(canRestCard(card)).toBe(true);
			});

			it("returns true for Base in shield base", () => {
				const card = createTestCard({
					position: "active",
					zone: "shieldBase",
					cardType: "Base",
				});
				expect(canRestCard(card)).toBe(true);
			});
		});

		describe("canActivateCard", () => {
			it("returns true when card is rested", () => {
				const card = createTestCard({ position: "rested" });
				expect(canActivateCard(card)).toBe(true);
			});

			it("returns false when card is already active", () => {
				const card = createTestCard({ position: "active" });
				expect(canActivateCard(card)).toBe(false);
			});

			it("returns true for Units that can be readied", () => {
				const card = createTestCard({
					position: "rested",
					zone: "battleArea",
					cardType: "Unit",
				});
				expect(canActivateCard(card)).toBe(true);
			});

			it("returns true for Resources that can be readied", () => {
				const card = createTestCard({
					position: "rested",
					zone: "resourceArea",
					cardType: "Resource",
				});
				expect(canActivateCard(card)).toBe(true);
			});
		});
	});

	describe("Edge cases and special rules", () => {
		it("handles multiple position changes correctly", () => {
			let card = createTestCard({ position: "active" });

			// Rest the card
			const restResult = restCard(card);
			expect(restResult.success).toBe(true);
			if (restResult.success) {
				card = restResult.data;
				expect(card.position).toBe("rested");
			}

			// Activate the card
			const activateResult = activateCard(card);
			expect(activateResult.success).toBe(true);
			if (activateResult.success) {
				card = activateResult.data;
				expect(card.position).toBe("active");
			}

			// Rest again
			const restAgainResult = restCard(card);
			expect(restAgainResult.success).toBe(true);
			if (restAgainResult.success) {
				expect(restAgainResult.data.position).toBe("rested");
			}
		});

		it("preserves all other card properties during position change", () => {
			const card = createTestCard({
				position: "active",
				id: "unit-123",
				cardType: "Unit",
				zone: "battleArea",
				ownerId: "player1",
			});

			const result = restCard(card);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("unit-123");
				expect(result.data.cardType).toBe("Unit");
				expect(result.data.zone).toBe("battleArea");
				expect(result.data.ownerId).toBe("player1");
			}
		});

		it("Rule 1-3-2-1: attempting to rest already rested card does not change state", () => {
			const card = createTestCard({ position: "rested" });
			const result = restCard(card);

			if (result.success) throw new Error("Expected error result");
			expect(result.success).toBe(false);
			// Card should remain unchanged (immutability - original is not modified)
			expect(card.position).toBe("rested");
		});

		it("Rule 1-3-2-1: attempting to activate already active card does not change state", () => {
			const card = createTestCard({ position: "active" });
			const result = activateCard(card);

			if (result.success) throw new Error("Expected error result");
			expect(result.success).toBe(false);
			// Card should remain unchanged (immutability - original is not modified)
			expect(card.position).toBe("active");
		});
	});

	describe("Type safety", () => {
		it("enforces CardPosition type at compile time", () => {
			const card = createTestCard();
			// This should compile
			const position: CardPosition = card.position;
			expect(["active", "rested"]).toContain(position);
		});

		it("Result type provides type-safe error handling", () => {
			const card = createTestCard({ position: "active" });
			const result = activateCard(card);

			// TypeScript should know this is an error result
			if (!result.success) {
				const errorType: "alreadyInPosition" = result.error.type;
				expect(errorType).toBe("alreadyInPosition");
			}
		});
	});
});
