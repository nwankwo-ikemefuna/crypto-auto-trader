import { PuppeteerLifeCycleEvent } from "puppeteer";

export type TwaitUntil = "networkidle0" | "load" | "domcontentloaded" | "networkidle2" | PuppeteerLifeCycleEvent[] | undefined;