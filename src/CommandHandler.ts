import path from "path";
import fs from "fs";
import Command from "./Command";
import WovenClient from "./Client";
import { Message, Collection } from "discord.js";
import Utils from "./Utils";

export default class CommandHandler {
  /**
   * Client responsible for this CommandHandler
   */
  public client: WovenClient;
  /**
   * The cache for commands that this handler holds
   */
  public cache: Collection<string, Command>;
  /**
   * The directory in which commands for this handler exist
   */
  private commandDir: string;
  public commandsInvoked: number;
  public commandsSuccess: number;
  public commandsFailed: number;

  /**
   * Handler for commands for the bot
   * @param client The client that this command handler belongs to
   * @param commandDir The directory of all the commands of the bot
   */
  constructor(client: WovenClient, commandDir: string) {
    this.client = client;
    this.cache = new Collection();
    this.commandDir = path.join(
      path.dirname(require.main.filename),
      commandDir
    );
    this._readCommands();

    this.client.on("message", (message: Message) => {
      if (message.author.bot && this.client.wovenOptions.ignoreBots) return;
      let invoke = message.content.split(" ")[0];
      if (
        !this.client.wovenOptions.prefixes.some(prefix =>
          invoke.toLowerCase().startsWith(prefix.toLowerCase())
        )
      )
        return;
      const prefix = this.client.wovenOptions.prefixes.find(prefix =>
        invoke.toLowerCase().startsWith(prefix.toLowerCase())
      );
      invoke = invoke.slice(prefix.length, invoke.length);
      if (!this.cache.has(invoke))
        return message.channel.send(
          `${message.author.toString()}, try doing \`${prefix}help\` to see what my commands are!`
        );
      this.commandsInvoked++;
      const command = this.cache.get(invoke);
      command
        .exec(message, message.content.split(" ").slice(1))
        .then(() => {
          this.commandsSuccess++;
        })
        .catch(err => {
          this.commandsFailed++;
          this.client.console.error(err);
        });
    });
  }

  /**
   * Read the commands from the command directory
   */
  private _readCommands() {
    const categories = fs.readdirSync(this.commandDir);
    this.client.console.info(
      `Added ${Utils.pluralify(
        categories.filter(category => category.includes(".")).length,
        "command"
      )} with no category, setting its category to "Misc"`
    );
    categories
      .filter(category => category.includes("."))
      .forEach(category => {
        this._addCommand(path.join(this.commandDir, category), "misc");
      });
    categories
      .filter(category => !category.includes("."))
      .forEach(category => {
        const commands = fs.readdirSync(path.join(this.commandDir, category));
        this.client.console.info(
          `Added ${Utils.pluralify(
            commands.length,
            `${Utils.titleCase(category)} command`
          )}`
        );
        commands.forEach(command => {
          this._addCommand(
            path.join(this.commandDir, category, command),
            category
          );
        });
      });
  }

  /**
   * Add a command to cache
   * @param dir Directory of the command
   * @param category Category in which the command was found
   */
  private _addCommand(dir, category) {
    const cmdRef = require(dir).default;
    const cmd = new cmdRef(this.client);
    cmd.category = Utils.titleCase(category);
    this.cache.set(cmd.name, cmd);
    cmd.options.aliases.forEach(alias => this.cache.set(alias, cmd));
  }

  /**
   * Refresh all the commands in cache
   */
  public refreshCommands() {
    this.cache = new Collection();
    this._readCommands();
  }
}
