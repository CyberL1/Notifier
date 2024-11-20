export const debugLog = (...args: string[]) => {
  if (process.env.DEBUG === "yes") {
    console.log("[DEBUG]", ...args);
  }
};
