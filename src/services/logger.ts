export interface Logger {
  info(event: string, details?: Record<string, string>): void
  warn(event: string, details?: Record<string, string>): void
  error(event: string, details?: Record<string, string>): void
}

export class ConsoleLogger implements Logger {
  info(event: string, details?: Record<string, string>) { console.info(`[Receipt] ${event}`, details) }
  warn(event: string, details?: Record<string, string>) { console.warn(`[Receipt] ${event}`, details) }
  error(event: string, details?: Record<string, string>) { console.error(`[Receipt] ${event}`, details) }
}