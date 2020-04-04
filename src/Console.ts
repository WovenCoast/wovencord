import Utils from "./Utils";
import chalk from "chalk";

export default class Console {
  public themes: any;

  constructor() {
    this.themes = {
      log: chalk.bgYellow.white,
      error: chalk.bgRed.white,
      info: chalk.bgBlue.white
    };
  }

  private _output(theme: string, ...input: any[]) {
    const parsed =
      input
        .map((e: any) => e.toString())
        .join("")
        .split("\n")
        .map(
          (e: string) =>
            this.themes[theme](
              ` ${new Date(Date.now()).toLocaleTimeString()} `
            ) +
            " " +
            e
        )
        .join("\n") + "\n";
    process.stdout.write(parsed);
    return parsed;
  }

  private _error(theme: string, ...input: any[]) {
    const parsed =
      input
        .map((e: any) => e.toString())
        .join("")
        .split("\n")
        .map(
          (e: string) =>
            this.themes[theme](
              ` ${new Date(Date.now()).toLocaleTimeString()} `
            ) +
            " " +
            e
        )
        .join("\n") + "\n";
    process.stderr.write(parsed);
    process.stdout.write(parsed);
    return parsed;
  }

  log(...input: any[]) {
    return this._output("log", ...input);
  }
  error(...input: any[]) {
    return this._error("error", ...input);
  }
  info(...input: any[]) {
    return this._output("info", ...input);
  }
}
