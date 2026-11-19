import { cleanDrawing, type Drawing } from "./creative";
const memory = new Map<string, Drawing>();
let opening: Promise<IDBDatabase> | undefined;
function database() {
  if (!opening)
    opening = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("young-inventors.drawings", 1);
      request.onupgradeneeded = () =>
        request.result.createObjectStore("drawings");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () =>
        reject(Error("Drawing storage is busy in another tab."));
    }).catch((error) => {
      opening = undefined;
      throw error;
    });
  return opening;
}
export async function readDrawing(id: string): Promise<Drawing | null> {
  if (memory.has(id)) return memory.get(id)!;
  const db = await database();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction("drawings", "readonly")
      .objectStore("drawings")
      .get(id);
    req.onsuccess = () => {
      try {
        resolve(req.result ? cleanDrawing(req.result) : null);
      } catch (e) {
        reject(e);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
export async function writeDrawing(id: string, value: Drawing): Promise<void> {
  cleanDrawing(value);
  memory.set(id, structuredClone(value));
  await writeDrawings({ [id]: value });
}
export async function writeDrawings(
  items: Record<string, Drawing>,
): Promise<void> {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("drawings", "readwrite");
    for (const [id, value] of Object.entries(items))
      tx.objectStore("drawings").put(value, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () =>
      reject(tx.error || Error("Drawing save was interrupted."));
  });
  for (const [id, value] of Object.entries(items))
    memory.set(id, structuredClone(value));
}
export async function deleteDrawings(ids: string[]) {
  ids.forEach((id) => memory.delete(id));
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("drawings", "readwrite");
    ids.forEach((id) => tx.objectStore("drawings").delete(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
