export interface SimulatorStatement {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
  withdrawnAt?: number;
  replyToId?: string;
  acknowledgements: string[];
}

export interface SimulatorActivityEntry {
  id: string;
  actorId: string;
  at: number;
  summary: string;
}

export interface SimulatorStatementsState {
  statements: SimulatorStatement[];
  spotlightStatementId?: string;
  activity: SimulatorActivityEntry[];
}

interface SimulatorStatementActionBase {
  actorId: string;
  actionId: string;
  at: number;
}

export type SimulatorStatementAction =
  | (SimulatorStatementActionBase & {
      type: "publish_statement";
      statementId: string;
      text: string;
      replyToId?: string;
    })
  | (SimulatorStatementActionBase & { type: "withdraw_statement"; statementId: string })
  | (SimulatorStatementActionBase & { type: "acknowledge_statement"; statementId: string })
  | (SimulatorStatementActionBase & { type: "spotlight_statement"; statementId?: string });

export type SimulatorStatementActionInput = {
  [Type in SimulatorStatementAction["type"]]: Omit<
    Extract<SimulatorStatementAction, { type: Type }>,
    keyof SimulatorStatementActionBase
  >;
}[SimulatorStatementAction["type"]];
