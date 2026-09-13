import { useEffect, useId, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { buildBugTriageHref, submitBugReport, type BugReportContext } from "./bugReportApi.ts";

const MAX_DESCRIPTION_LENGTH = 5_000;

type SubmissionState =
  | { readonly status: "idle" }
  | { readonly status: "submitting" }
  | { readonly status: "success"; readonly reportId: string }
  | { readonly status: "error"; readonly message: string };

export interface BugReportDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly context: BugReportContext;
  readonly source: string;
  readonly gameName: string;
}

export function BugReportDialog({
  open,
  onOpenChange,
  context,
  source,
  gameName,
}: BugReportDialogProps) {
  const textareaId = useId();
  const [description, setDescription] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  useEffect(() => {
    if (!open) {
      setDescription("");
      setSubmission({ status: "idle" });
      return;
    }
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const submitting = submission.status === "submitting";
  const canSubmit = description.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmission({ status: "submitting" });
    try {
      const result = await submitBugReport({
        description: description.trim(),
        source,
        context,
      });
      setSubmission({ status: "success", reportId: result.id });
    } catch (error) {
      setSubmission({
        status: "error",
        message: error instanceof Error ? error.message : "Could not submit this report.",
      });
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[1001] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/20 bg-slate-950 p-5 text-slate-50 shadow-2xl focus:outline-none">
          <header className="space-y-1">
            <DialogPrimitive.Title className="text-lg font-semibold text-white">
              Report a {gameName} bug
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm leading-6 text-slate-300">
              Describe what happened. The current game, turn, and replay position are attached
              automatically when available.
            </DialogPrimitive.Description>
          </header>

          {submission.status === "success" ? (
            <div className="mt-5 space-y-3 rounded-lg border border-emerald-300/30 bg-emerald-950/40 p-4 text-sm">
              <p className="text-emerald-100">Your report and match context were submitted.</p>
              <a
                className="inline-flex rounded-md border border-emerald-200/40 px-3 py-2 font-semibold text-emerald-100 hover:bg-emerald-200/10"
                href={buildBugTriageHref(context.gameSlug, submission.reportId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open triage workspace
              </a>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <label className="block text-sm font-semibold text-white" htmlFor={textareaId}>
                Bug details
              </label>
              <textarea
                id={textareaId}
                className="min-h-36 w-full resize-y rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
                value={description}
                maxLength={MAX_DESCRIPTION_LENGTH}
                disabled={submitting}
                placeholder="What did you expect, and what happened instead?"
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              <div className="flex justify-between gap-4 text-xs text-slate-400">
                <span>Match evidence is included when this is a hosted game.</span>
                <span>
                  {description.length} / {MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              {submission.status === "error" ? (
                <p role="alert" className="text-sm text-red-300">
                  {submission.message}
                </p>
              ) : null}
            </div>
          )}

          <footer className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
            {submission.status !== "success" ? (
              <button
                type="button"
                className="rounded-md bg-cyan-300 px-3 py-2 text-sm font-bold text-cyan-950 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canSubmit}
                onClick={() => void handleSubmit()}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
            ) : null}
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
