type AnyRecord = Record<string, unknown>;

function normalizeValue(value: unknown): unknown {
  if (typeof value === "string" && value.startsWith("=")) {
    const trimmed = value.slice(1);
    const num = Number(trimmed);

    if (!Number.isNaN(num)) {
      return Number(num.toFixed(2));
    }

    return trimmed;
  }

  if (typeof value === "number") {
    return Number(value.toFixed(2));
  }

  return value;
}

export function normalizeActivity<T extends AnyRecord>(activity: T): T {
  const normalized: AnyRecord = {};

  for (const [key, value] of Object.entries(activity)) {
    normalized[key] = normalizeValue(value);
  }

  return normalized as T;
}
