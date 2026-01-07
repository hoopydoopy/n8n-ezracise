// web/app/lib/store.ts

let latestN8nPayload: any = null;

export function setLatestPayload(data: any) {
  latestN8nPayload = data;
}

export function getLatestPayload() {
  return latestN8nPayload;
}
