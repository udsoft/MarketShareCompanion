export interface ExtractorPlugin {
    preRun(): void;
    run(): void;
    postRun(): void;
}