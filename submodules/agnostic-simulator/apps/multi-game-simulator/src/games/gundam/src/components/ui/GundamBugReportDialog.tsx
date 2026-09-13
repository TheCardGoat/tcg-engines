import { useEffect, useState } from "react";

import {
  buildBugTriageHref,
  submitBugReport,
  type BugReportContext,
} from "../../../../../runtime/bugReportApi.ts";
import { m } from "../../lib/i18n/messages.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/dialog.tsx";

const MAX_DESCRIPTION_LENGTH = 5_000;

interface GundamBugReportDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly context: BugReportContext;
}

type SubmissionState =
  | { readonly status: "idle" }
  | { readonly status: "submitting" }
  | { readonly status: "success"; readonly reportId: string }
  | { readonly status: "error"; readonly message: string };

export function GundamBugReportDialog({ open, onOpenChange, context }: GundamBugReportDialogProps) {
  const [description, setDescription] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  useEffect(() => {
    if (open) return;
    setDescription("");
    setSubmission({ status: "idle" });
  }, [open]);

  const submitting = submission.status === "submitting";
  const canSubmit = description.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmission({ status: "submitting" });
    try {
      const result = await submitBugReport({
        description: description.trim(),
        source: "simulator",
        context,
      });
      setSubmission({ status: "success", reportId: result.id });
    } catch (error) {
      setSubmission({
        status: "error",
        message: error instanceof Error ? error.message : m["sim.support.bugReport.submitError"](),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-950 p-0 text-cyan-50 shadow-2xl">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-cyan-50">{m["sim.support.bugReport.title"]()}</DialogTitle>
          <DialogDescription className="text-cyan-100/75">
            {m["sim.support.bugReport.description"]()}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-5 pb-4 pt-5">
          {submission.status === "success" ? (
            <div className="space-y-3 rounded border border-emerald-300/30 bg-emerald-950/30 p-4 text-sm">
              <p className="text-emerald-100">{m["sim.support.bugReport.success"]()}</p>
              <a
                className="inline-flex rounded border border-cyan-300/40 px-3 py-2 font-mono text-xs text-cyan-100 hover:bg-cyan-300/10"
                href={buildBugTriageHref(context.gameSlug, submission.reportId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {m["sim.support.bugReport.openTriage"]()}
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-cyan-50"
                htmlFor="gundam-bug-description"
              >
                {m["sim.support.bugReport.detailsLabel"]()}
              </label>
              <textarea
                id="gundam-bug-description"
                className="min-h-28 w-full resize-y rounded border border-cyan-300/30 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                value={description}
                maxLength={MAX_DESCRIPTION_LENGTH}
                disabled={submitting}
                placeholder={m["sim.support.bugReport.placeholder"]()}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              <div className="flex justify-between gap-4 text-xs text-cyan-100/70">
                <span>{m["sim.support.bugReport.contextNote"]()}</span>
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
        </div>

        <DialogFooter className="justify-end border-t border-cyan-300/20 bg-slate-950 px-5 py-3">
          <button
            type="button"
            className="rounded border border-cyan-100/40 px-3 py-2 font-mono text-xs text-cyan-50 hover:bg-white/5"
            onClick={() => onOpenChange(false)}
          >
            {m["sim.support.bugReport.close"]()}
          </button>
          {submission.status !== "success" ? (
            <button
              type="button"
              className="rounded border border-amber-300/60 bg-amber-300 px-3 py-2 font-mono text-xs font-bold text-amber-950 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canSubmit}
              onClick={() => void handleSubmit()}
            >
              {submitting
                ? m["sim.support.bugReport.submitting"]()
                : m["sim.support.bugReport.submit"]()}
            </button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
