import assert from "node:assert/strict";
import { test } from "node:test";
import { auditFaqInventory, renderFaqInventory } from "./card-faq-inventory.mjs";

const source = (id, name = id) => ({ id, name, slug: name });
const reference = (...ids) => ({
  file: "packages/engine/example.test.ts",
  title: "checks the ruling",
  faqIds: ids,
});
const group = (id, question = "Can I do this?", answer = "Yes.") => ({
  id,
  question,
  answer,
  sources: [source(id)],
  tests: [reference(id)],
});
const manifest = (...entries) => ({
  schemaVersion: 2,
  source: "https://example.com/faqs",
  verifiedDate: "2026-10-08",
  entries,
});
const feed = (...entries) =>
  new Map(
    entries.flatMap((entry) =>
      entry.sources.map((item) => [
        item.id,
        {
          question: item.question ?? entry.question,
          answer: item.answer ?? entry.answer,
        },
      ]),
    ),
  );

await test("repeated wording on different cards requires one group but coverage for both cards", () => {
  const a = group("a"),
    b = group("b", "  CAN I do this?  ");
  assert.throws(() => auditFaqInventory(manifest(a, b), feed(a, b)), /Duplicate FAQ wording/);
  a.sources.push({ ...source("b"), question: b.question });
  assert.throws(() => auditFaqInventory(manifest(a), feed(a)), /source b has no behavior test/);
  a.tests[0].faqIds.push("b");
  assert.equal(auditFaqInventory(manifest(a), feed(a)).verifiedSourceCount, 2);
  const document = renderFaqInventory(manifest(a));
  assert.match(document, /2 source FAQs are consolidated into 1 entries/);
  assert.match(document, /`a`/);
  assert.match(document, /`b`/);
});

await test("the same question with a different answer remains a separate ruling", () => {
  const a = group("a"),
    b = group("b", a.question, "No.");
  assert.equal(auditFaqInventory(manifest(a, b), feed(a, b)).sourceCount, 2);
});

await test("equivalent wording requires a recorded explanation and preserves exact source text", () => {
  const a = group("a");
  a.sources.push({ ...source("b"), question: "Is this permitted?" });
  a.tests[0].faqIds.push("b");
  assert.throws(
    () => auditFaqInventory(manifest(a), feed(a)),
    /explanation for equivalent wording/,
  );
  a.consolidation = "Both questions ask the same permission boundary.";
  assert.equal(auditFaqInventory(manifest(a), feed(a)).sourceCount, 2);
  assert.match(renderFaqInventory(manifest(a)), /Wording: Is this permitted\?/);
});

await test("a new or changed official FAQ cannot silently keep old coverage", () => {
  const a = group("a");
  const changed = new Map([["a", { question: a.question, answer: "No." }]]);
  assert.throws(() => auditFaqInventory(manifest(a), changed), /missing or changed/);
  const current = feed(a);
  current.set("new", { question: "New ruling?", answer: "Yes." });
  assert.throws(() => auditFaqInventory(manifest(a), current), /New scraped FAQ new/);
});

await test("a source cannot appear twice or borrow coverage from another group", () => {
  const a = group("a"),
    b = group("b", "Another question?");
  a.sources.push(source("a"));
  assert.throws(() => auditFaqInventory(manifest(a), feed(a)), /Duplicate coverage source/);
  a.sources.pop();
  a.tests[0].faqIds = ["b"];
  assert.throws(() => auditFaqInventory(manifest(a, b), feed(a, b)), /outside its FAQ group/);
});

await test("duplicate test links are rejected instead of inflating coverage", () => {
  const a = group("a");
  a.tests.push(reference("a"));
  assert.throws(() => auditFaqInventory(manifest(a), feed(a)), /duplicate test reference/);
});

await test("source conflicts remain excluded from verified FAQ coverage", () => {
  const a = group("a");
  a.conflict = {
    reason: "FAQ contradicts retail text.",
    policy: "awaiting-decision",
    cardSource: "https://example.com/card",
  };
  const audit = auditFaqInventory(manifest(a), feed(a));
  assert.equal(audit.sourceCount, 1);
  assert.equal(audit.verifiedSourceCount, 0);
  assert.equal(audit.conflicts.length, 1);
  assert.match(
    renderFaqInventory(manifest(a)),
    /current-behavior tests do not verify the FAQ ruling/,
  );
});
