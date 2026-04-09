"use client";

import { FormEvent, useEffect, useState } from "react";

type PredictionResult = {
  prediction: number;
  probability: number;
  label: "ckd" | "not_ckd";
  confidence: "high" | "medium" | "low";
};

type PredictionMeta = {
  phase: string;
  modelType: string;
  artifactsAvailable: boolean;
  metrics: Record<string, string | number | object>;
};

type InputState = {
  age: string;
  bp: string;
  bgr: string;
  bu: string;
  sc: string;
  hemo: string;
  htn: string;
  dm: string;
  rbc: string;
  pc: string;
};

const defaultInput: InputState = {
  age: "",
  bp: "",
  bgr: "",
  bu: "",
  sc: "",
  hemo: "",
  htn: "no",
  dm: "no",
  rbc: "normal",
  pc: "normal",
};

export default function PredictionPanel() {
  const [input, setInput] = useState<InputState>(defaultInput);
  const [meta, setMeta] = useState<PredictionMeta | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      return;
    }

    fetch("/api/backend/predictions/meta", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "unable to load prediction metadata");
        }
        return data;
      })
      .then((data: PredictionMeta) => setMeta(data))
      .catch((error: Error) => setMessage(error.message));
  }, []);

  function updateField<K extends keyof InputState>(key: K, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setMessage("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/backend/predictions/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "prediction failed");
        setResult(null);
        return;
      }

      setResult(data.result as PredictionResult);
    } catch {
      setMessage("Prediction service is unavailable");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const accuracy = typeof meta?.metrics?.accuracy === "number" ? meta.metrics.accuracy : null;

  return (
    <section className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Early CKD Prediction (Phase 1)</h3>
          <p className="text-sm text-gray-500">Nearest-neighbor baseline for accurate initial prediction</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Model</p>
          <p className="text-sm font-medium">{meta?.modelType || "Loading..."}</p>
          {accuracy !== null && <p className="text-xs text-gray-500">Accuracy: {(accuracy * 100).toFixed(2)}%</p>}
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-600">
          Age
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.age} onChange={(e) => updateField("age", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Blood Pressure (bp)
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.bp} onChange={(e) => updateField("bp", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Blood Glucose Random (bgr)
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.bgr} onChange={(e) => updateField("bgr", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Blood Urea (bu)
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.bu} onChange={(e) => updateField("bu", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Serum Creatinine (sc)
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.sc} onChange={(e) => updateField("sc", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Hemoglobin (hemo)
          <input className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.hemo} onChange={(e) => updateField("hemo", e.target.value)} />
        </label>
        <label className="text-sm text-gray-600">
          Hypertension (htn)
          <select className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.htn} onChange={(e) => updateField("htn", e.target.value)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          Diabetes Mellitus (dm)
          <select className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.dm} onChange={(e) => updateField("dm", e.target.value)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          Red Blood Cells (rbc)
          <select className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.rbc} onChange={(e) => updateField("rbc", e.target.value)}>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          Pus Cell (pc)
          <select className="mt-1 w-full border border-[#e5e5e5] rounded-md px-3 py-2" value={input.pc} onChange={(e) => updateField("pc", e.target.value)}>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
          </select>
        </label>

        <div className="md:col-span-2 flex items-center justify-between gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium disabled:opacity-70">
            {loading ? "Predicting..." : "Run Prediction"}
          </button>

          {result && (
            <div className="text-sm text-right">
              <p className="font-semibold">Result: {result.label.toUpperCase()}</p>
              <p className="text-gray-600">Probability: {(result.probability * 100).toFixed(2)}%</p>
              <p className="text-gray-600">Confidence: {result.confidence}</p>
            </div>
          )}
        </div>

        {message && <p className="md:col-span-2 text-sm text-gray-600">{message}</p>}
      </form>
    </section>
  );
}
