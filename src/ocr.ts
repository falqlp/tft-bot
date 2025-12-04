import {createWorker, PSM, type Worker} from "tesseract.js";
import {ScreenRegion} from "./regions";
import crypto from "node:crypto";

let workerPromise: Promise<Worker> | null = null;

async function getWorker(): Promise<Worker> {
    if (!workerPromise) {
        workerPromise = (async () => {
            const worker = await createWorker("eng");
            await worker.setParameters({
                tessedit_pageseg_mode: PSM.SINGLE_LINE,
            });
            return worker;
        })();
    }
    return workerPromise;
}

async function recognizeText(buffer: Buffer): Promise<string> {
    const worker = await getWorker();
    const { data } = await worker.recognize(buffer);
    return data.text.trim();
}

type SlotCache = {
    hash: string;
    text: string;
};

const shopCache: Record<string, SlotCache | undefined> = {};

function hashBuffer(buffer: Buffer): string {
    return crypto.createHash("md5").update(buffer).digest("hex");
}

export async function readSlotWithCache(
    slotName: string,
    buffer: Buffer
): Promise<string> {
    const h = hashBuffer(buffer);

    const cacheEntry = shopCache[slotName];

    if (cacheEntry && cacheEntry.hash === h) {
        return cacheEntry.text;
    }
    const text = await recognizeText(buffer);
    shopCache[slotName] = { hash: h, text };
    return text;
}
