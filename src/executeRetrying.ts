export async function executeRetrying<T>(fct: () => Promise<T>, options: { retries: number }) {
  let lastError: Error | undefined = undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fct();
    } catch (e) {
      lastError = e as Error;
    }
  }

  throw lastError;
}
