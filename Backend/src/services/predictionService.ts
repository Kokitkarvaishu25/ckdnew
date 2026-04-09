import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const projectRoot = path.resolve(__dirname, "../../..");
const ckdRoot = path.join(projectRoot, "CKDnew");
const predictScriptPath = path.join(ckdRoot, "predict_cli.py");
const modelArtifactsPath = path.join(ckdRoot, "model_artifacts");
const metricsPath = path.join(modelArtifactsPath, "metrics.json");
const featuresPath = path.join(modelArtifactsPath, "features.json");

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export function getPredictionMeta() {
  const metrics = readJsonFile<Record<string, unknown>>(metricsPath, {});
  const features = readJsonFile<string[]>(featuresPath, []);

  return {
    phase: "phase-1-nearest-baseline",
    modelType: "KNN (Nearest Neighbors)",
    artifactsAvailable: fs.existsSync(path.join(modelArtifactsPath, "phase1_knn_model.joblib")),
    metrics,
    features,
  };
}

export async function predictCkd(payload: Record<string, unknown>) {
  const pythonExecutable = process.env.PYTHON_EXECUTABLE || "python";
  const serialized = JSON.stringify(payload);

  const { stdout, stderr } = await execFileAsync(pythonExecutable, [predictScriptPath, serialized], {
    cwd: ckdRoot,
    windowsHide: true,
    timeout: 15000,
    maxBuffer: 1024 * 1024,
  });

  if (stderr && stderr.trim()) {
    throw new Error(stderr.trim());
  }

  return JSON.parse(stdout) as {
    prediction: number;
    probability: number;
    label: "ckd" | "not_ckd";
    confidence: "high" | "medium" | "low";
  };
}
