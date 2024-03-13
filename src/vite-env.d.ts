/// <reference types="vite/client" />
declare module "annyang" {
  export interface Commands {
    [phrase: string]: (...args: unknown[]) => void;
  }

  export interface Annyang {
    start(options?: { autoRestart?: boolean; continuous?: boolean }): void;
    abort(): void;
    pause(): void;
    resume(): void;
    addCommands(commands: Commands, context?: unknown): void;
    removeCommands(commands?: Commands): void;
    getSpeechRecognizer(): unknown;
    setLanguage(language: string): void;
    addCallback(type: string, callback: () => void, context?: unknown): void;
    removeCallback(type: string, callback: () => void): void;
  }

  const annyang: Annyang;
  export default annyang;
}
