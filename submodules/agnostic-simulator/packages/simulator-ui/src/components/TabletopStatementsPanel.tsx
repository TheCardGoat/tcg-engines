import type {
  SimulatorStatementActionInput,
  SimulatorStatementsState,
} from "@tcg/simulator-contract";
import { useEffect, useRef, useState } from "react";

import { cx } from "../class-names";
import classes from "./TabletopStatementsPanel.module.css";

export interface TabletopStatementsPanelProps {
  readonly state: SimulatorStatementsState;
  readonly viewerId: string;
  readonly readOnly?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly title?: string;
  readonly resolveActorLabel?: (actorId: string) => string;
  readonly onAction?: (action: SimulatorStatementActionInput) => void;
}

export function TabletopStatementsPanel({
  state,
  viewerId,
  readOnly = false,
  disabled = false,
  className,
  title = "Announcements",
  resolveActorLabel,
  onAction,
}: TabletopStatementsPanelProps) {
  const [replyToId, setReplyToId] = useState<string>();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const canEdit = !readOnly && !disabled;
  const actorLabel = (actorId: string) =>
    actorId === viewerId ? "You" : (resolveActorLabel?.(actorId) ?? actorId);

  const beginReply = (statementId: string) => {
    setReplyToId(statementId);
  };

  useEffect(() => {
    if (replyToId) editorRef.current?.focus();
  }, [replyToId]);

  return (
    <aside className={cx(classes.panel, className)} aria-label={title}>
      <h2>{title}</h2>
      {canEdit ? (
        <form
          className={classes.composer}
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const value = new FormData(form).get("statement");
            const text = typeof value === "string" ? value.trim() : "";
            if (!text) return;
            onAction?.({
              type: "publish_statement",
              statementId: crypto.randomUUID(),
              text,
              ...(replyToId ? { replyToId } : {}),
            });
            form.reset();
            setReplyToId(undefined);
          }}
        >
          {replyToId ? (
            <div className={classes.replyContext}>
              <span>Replying to a statement</span>
              <button type="button" onClick={() => setReplyToId(undefined)}>
                Cancel
              </button>
            </div>
          ) : null}
          <label className={classes.srOnly} htmlFor="simulator-statement-composer">
            {replyToId ? "Write a reply" : "Write an announcement"}
          </label>
          <textarea
            ref={editorRef}
            id="simulator-statement-composer"
            name="statement"
            maxLength={500}
            placeholder={replyToId ? "Write a reply" : "Declare intent, trigger, or resolution"}
            required
          />
          <button type="submit">{replyToId ? "Reply" : "Publish"}</button>
        </form>
      ) : null}

      <div className={classes.statementList} aria-live="polite">
        {state.statements.length === 0 ? (
          <p className={classes.empty}>No announcements yet.</p>
        ) : null}
        {state.statements.map((statement) => {
          const acknowledged = statement.acknowledgements.includes(viewerId);
          const spotlit = state.spotlightStatementId === statement.id;
          return (
            <article
              key={statement.id}
              className={cx(classes.statement, spotlit && classes.spotlit)}
            >
              <strong>{actorLabel(statement.authorId)}</strong>
              <p>{statement.withdrawnAt ? "Statement withdrawn" : statement.text}</p>
              <small>
                {statement.acknowledgements.length} acknowledged
                {statement.replyToId ? " · reply" : ""}
              </small>
              {canEdit && !statement.withdrawnAt ? (
                <div className={classes.statementActions}>
                  <button
                    type="button"
                    disabled={acknowledged}
                    onClick={() =>
                      onAction?.({ type: "acknowledge_statement", statementId: statement.id })
                    }
                  >
                    {acknowledged ? "Acknowledged" : "Acknowledge"}
                  </button>
                  <button
                    type="button"
                    aria-pressed={spotlit}
                    onClick={() =>
                      onAction?.({
                        type: "spotlight_statement",
                        ...(spotlit ? {} : { statementId: statement.id }),
                      })
                    }
                  >
                    {spotlit ? "Clear spotlight" : "Spotlight"}
                  </button>
                  <button type="button" onClick={() => beginReply(statement.id)}>
                    Reply
                  </button>
                  {statement.authorId === viewerId ? (
                    <button
                      type="button"
                      onClick={() =>
                        onAction?.({ type: "withdraw_statement", statementId: statement.id })
                      }
                    >
                      Withdraw
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <h3>Activity</h3>
      <ol className={classes.activity}>
        {state.activity
          .slice(-20)
          .toReversed()
          .map((item) => (
            <li key={item.id}>
              <strong>{actorLabel(item.actorId)}</strong>: {item.summary}
            </li>
          ))}
      </ol>
    </aside>
  );
}
