import process from "child_process";

export function type(toType: string) {
  process.execSync(`echo 'tell application "System Events" to keystroke "${toType}"' | osascript`)
}
