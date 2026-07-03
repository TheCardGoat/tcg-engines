import {
  cssString,
  type SimulatorDomDriver,
  type SimulatorDomElement,
} from "@tcg/simulator-testing";

/**
 * POM for the shared simulator `InteractionPanel`.
 *
 * Every game action is surfaced as an "interaction card" with candidate
 * buttons, option chips, and a submit button. This helper lets the Cyberpunk
 * POM drive the game by clicking those UI elements instead of calling engine
 * methods directly.
 */
export class InteractionPanelPom {
  private readonly dom: SimulatorDomDriver;

  constructor(dom: SimulatorDomDriver) {
    this.dom = dom;
  }

  root(): SimulatorDomElement {
    return this.dom.locator('[aria-label="Interaction panel"]');
  }

  interactionCard(interactionId: string): SimulatorDomElement {
    return this.root().locator(`[data-testid=${cssString(`interaction-card:${interactionId}`)}]`);
  }

  interactionCardByMoveCommand(moveCommand: string): SimulatorDomElement {
    return this.root().locator(`[data-move-command=${cssString(moveCommand)}]`);
  }

  candidateButton(interactionId: string, entityId: string): SimulatorDomElement {
    return this.root().locator(
      `[data-testid=${cssString(`interaction-candidate:${interactionId}:${entityId}`)}]`,
    );
  }

  paymentButton(interactionId: string, entityId: string): SimulatorDomElement {
    return this.root().locator(
      `[data-testid=${cssString(`interaction-payment:${interactionId}:${entityId}`)}]`,
    );
  }

  orderButton(interactionId: string, entityId: string): SimulatorDomElement {
    return this.root().locator(
      `[data-testid=${cssString(`interaction-order:${interactionId}:${entityId}`)}]`,
    );
  }

  optionButton(interactionId: string, optionId: string): SimulatorDomElement {
    return this.interactionCard(interactionId).locator(
      `[data-testid=${cssString(`choice-chip:${optionId}`)}]`,
    );
  }

  submitButton(interactionId: string): SimulatorDomElement {
    return this.root().locator(`[data-testid=${cssString(`interaction-submit:${interactionId}`)}]`);
  }

  async interactionIdForMoveCommand(moveCommand: string): Promise<string> {
    const interactionId =
      await this.interactionCardByMoveCommand(moveCommand).getAttribute("data-interaction-id");
    if (!interactionId) {
      throw new Error(`No interaction card found for move command ${moveCommand}.`);
    }
    return interactionId;
  }

  async submitInteraction(interactionId: string): Promise<void> {
    await this.submitButton(interactionId).clickJs();
  }

  async submitByMoveCommand(moveCommand: string): Promise<void> {
    const interactionId = await this.interactionIdForMoveCommand(moveCommand);
    await this.submitInteraction(interactionId);
  }

  async selectCandidate(interactionId: string, entityId: string): Promise<void> {
    await this.candidateButton(interactionId, entityId).clickJs();
  }

  async selectCandidateByMoveCommand(moveCommand: string, entityId: string): Promise<void> {
    const interactionId = await this.interactionIdForMoveCommand(moveCommand);
    await this.selectCandidate(interactionId, entityId);
  }

  async selectPayment(interactionId: string, entityId: string): Promise<void> {
    await this.paymentButton(interactionId, entityId).clickJs();
  }

  async selectOption(interactionId: string, optionId: string): Promise<void> {
    await this.optionButton(interactionId, optionId).clickJs();
  }

  async selectOptionByMoveCommand(moveCommand: string, optionId: string): Promise<void> {
    const interactionId = await this.interactionIdForMoveCommand(moveCommand);
    await this.selectOption(interactionId, optionId);
  }

  async selectOrderEntity(interactionId: string, entityId: string): Promise<void> {
    await this.orderButton(interactionId, entityId).clickJs();
  }
}
