import { PuppeteerLifeCycleEvent } from "puppeteer";

export type TWaitUntil = "networkidle0" | "load" | "domcontentloaded" | "networkidle2" | PuppeteerLifeCycleEvent[] | undefined;