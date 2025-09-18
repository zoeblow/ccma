// Type augmentation for commander-completion
declare module 'commander' {
  interface Command {
    completion(fn: (info: any, cb: (err: any, results?: string[]) => void) => void): Command;
  }
}

export {};