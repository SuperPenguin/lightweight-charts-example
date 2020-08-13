/**
 * Declaration based on draft: https://www.w3.org/TR/resize-observer-1/
 * Last Updated: 2020-08-06
 * Note: as of 2020-08-06, Firefox 69 -> latest stable still use borderBoxSize/contentBoxSize ResizeObserverSize
 * instead of ResizeObserverSize[]. This current definition is modified to maintain compatibility with Firefox
 */

declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe: (target: Element, options?: ResizeObserverOptions) => void;
    unobserve: (target: Element) => void;
    disconnect: () => void;
}

type ResizeObserverBoxOptions = "border-box" | "content-box" | "device-pixel-content-box";

interface ResizeObserverOptions {
    box?: ResizeObserverBoxOptions;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize: ResizeObserverSize[] | ResizeObserverSize;
    readonly contentBoxSize: ResizeObserverSize[] | ResizeObserverSize;
    readonly devicePixelContentBoxSize: ResizeObserverSize[];
}

interface ResizeObserverSize {
    readonly inlineSize: number;
    readonly blockSize: number;
}

interface Window {
    ResizeObserver: typeof ResizeObserver;
}
