import { useState } from "react";
import type { Incident } from "./domain";
import { requestEventNarration, type FeedbackResult } from "./feedback";
import { Button } from "./ui";
const cache = new Map<string, FeedbackResult>();
export default function IncidentNarration({
  incident,
}: {
  incident: Incident;
}) {
  const revision =
    incident.id +
    ":" +
    incident.stage +
    ":" +
    incident.evidence.map((e) => Number(e.checked)).join("") +
    ":" +
    (incident.resolvedChoice || "");
  const [result, setResult] = useState<{
    revision: string;
    value: FeedbackResult;
  }>();
  const [busy, setBusy] = useState(false);
  const narrate = async () => {
    if (busy) return;
    const existing = cache.get(revision);
    if (existing) {
      setResult({ revision, value: existing });
      return;
    }
    setBusy(true);
    try {
      const value = await requestEventNarration({
        title: incident.title,
        description: incident.description,
        sign: incident.sign,
        evidence: incident.evidence.map((e) => ({
          label: e.label,
          fact: e.fact,
          checked: e.checked,
        })),
        choiceLabel: incident.choices.find(
          (c) => c.id === incident.resolvedChoice,
        )?.label,
        outcome: incident.outcome,
      });
      cache.set(revision, value);
      setResult({ revision, value });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ marginTop: 12 }}>
      <Button
        kind="small"
        icon="recipe"
        disabled={busy}
        onClick={() => void narrate()}
      >
        {busy ? "Đang đọc dữ kiện…" : "Diễn đạt hồ sơ đã biết"}
      </Button>
      {result?.revision === revision && (
        <blockquote className="feedback">
          {result.value.text}
          <small>
            {result.value.source === "ai" ? "Diễn đạt AI" : "Diễn đạt cục bộ"} ·
            Chỉ dữ kiện đã kiểm chứng, không thay đổi kết quả vụ việc.
          </small>
        </blockquote>
      )}
    </div>
  );
}
