import { logger } from "~/shared/logger";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

export function resolveBag(
  this: LorcanaCoreOperations,
  triggerId: string,
): void {
  logger.log(
    `Before resolving bag, current bag state: ${JSON.stringify(this.state.G.bag)}`,
  );
  this.state.G.bag = this.state.G.bag.filter((item) => item.id !== triggerId);
  logger.log(
    `After resolving bag, current bag state: ${JSON.stringify(this.state.G.bag)}`,
  );
}
