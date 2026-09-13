import type {
  SimulatorActivityEntry,
  SimulatorStatement,
  SimulatorStatementAction,
  SimulatorStatementsState,
} from "@tcg/simulator-contract";

export const SIMULATOR_STATEMENT_TEXT_LIMIT = 500;
export const SIMULATOR_ACTIVITY_LIMIT = 200;

export function appendSimulatorActivity<TState extends SimulatorStatementsState>(
  state: TState,
  entry: SimulatorActivityEntry,
  limit = SIMULATOR_ACTIVITY_LIMIT,
): TState {
  return {
    ...state,
    activity: state.activity.concat(entry).slice(-Math.max(0, limit)),
  };
}

export function reduceSimulatorStatements<TState extends SimulatorStatementsState>(
  state: TState,
  action: SimulatorStatementAction,
): TState {
  const next: TState = {
    ...state,
    statements: state.statements.map(cloneStatement),
    activity: [...state.activity],
  };
  let summary: string;

  switch (action.type) {
    case "publish_statement": {
      const text = action.text.trim().slice(0, SIMULATOR_STATEMENT_TEXT_LIMIT);
      if (!text) throw new Error("Statement text is required");
      if (next.statements.some((statement) => statement.id === action.statementId)) {
        throw new Error(`Statement already exists: ${action.statementId}`);
      }
      if (action.replyToId) requireStatement(next, action.replyToId);
      next.statements.push({
        id: action.statementId,
        authorId: action.actorId,
        text,
        createdAt: action.at,
        ...(action.replyToId ? { replyToId: action.replyToId } : {}),
        acknowledgements: [],
      });
      summary = action.replyToId ? "replied to a statement" : "published a statement";
      break;
    }
    case "withdraw_statement": {
      const statement = requireStatement(next, action.statementId);
      if (statement.authorId !== action.actorId) {
        throw new Error("Only the author may withdraw a statement");
      }
      statement.withdrawnAt ??= action.at;
      if (next.spotlightStatementId === statement.id) delete next.spotlightStatementId;
      summary = "withdrew a statement";
      break;
    }
    case "acknowledge_statement": {
      const statement = requireStatement(next, action.statementId);
      if (!statement.acknowledgements.includes(action.actorId)) {
        statement.acknowledgements.push(action.actorId);
      }
      summary = "acknowledged a statement";
      break;
    }
    case "spotlight_statement":
      if (action.statementId) requireStatement(next, action.statementId);
      if (action.statementId) next.spotlightStatementId = action.statementId;
      else delete next.spotlightStatementId;
      summary = action.statementId ? "spotlighted a statement" : "cleared the spotlight";
      break;
  }

  return appendSimulatorActivity(next, {
    id: action.actionId,
    actorId: action.actorId,
    at: action.at,
    summary,
  });
}

function cloneStatement(statement: SimulatorStatement): SimulatorStatement {
  return { ...statement, acknowledgements: [...statement.acknowledgements] };
}

function requireStatement(state: SimulatorStatementsState, id: string): SimulatorStatement {
  const statement = state.statements.find((item) => item.id === id);
  if (!statement) throw new Error(`Unknown statement: ${id}`);
  return statement;
}
