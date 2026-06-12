import type { SimulatorDomDriver, SimulatorDomElement } from "./dom-driver";
import { cssString } from "./dom-driver";

export class GenericSimulatorPom {
  readonly dom: SimulatorDomDriver;

  constructor(dom: SimulatorDomDriver) {
    this.dom = dom;
  }

  root(): SimulatorDomElement {
    return this.dom.locator(".simulator-shell");
  }

  fixtureButton(fixtureId: string): SimulatorDomElement {
    return this.dom.getByTestId(`fixture-button:${fixtureId}`);
  }

  zone(zoneId: string): SimulatorDomElement {
    return this.dom.locator(`[data-zone-id=${cssString(zoneId)}]`);
  }

  block(blockId: string): SimulatorDomElement {
    return this.dom.locator(`[data-block-id=${cssString(blockId)}]`);
  }

  card(entityId: string): SimulatorDomElement {
    return this.dom
      .locator(`[data-entity-id=${cssString(entityId)}], [data-card-id=${cssString(entityId)}]`)
      .first();
  }

  interaction(interactionId: string): SimulatorDomElement {
    return this.dom.getByTestId(`interaction-card:${interactionId}`);
  }

  interactionCandidate(interactionId: string, entityId: string): SimulatorDomElement {
    return this.dom.getByTestId(`interaction-candidate:${interactionId}:${entityId}`);
  }

  interactionSubmit(interactionId: string): SimulatorDomElement {
    return this.dom.getByTestId(`interaction-submit:${interactionId}`);
  }

  async selectFixture(fixtureId: string): Promise<void> {
    await this.fixtureButton(fixtureId).click();
  }

  async selectInteractionCandidate(interactionId: string, entityId: string): Promise<void> {
    await this.interactionCandidate(interactionId, entityId).click();
  }

  async submitInteraction(interactionId: string): Promise<void> {
    await this.interactionSubmit(interactionId).click();
  }
}
