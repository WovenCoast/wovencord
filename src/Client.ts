import { Client, ClientOptions } from "discord.js";
import Console from "./Console";
import Utils from "./Utils";
import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";

interface WovenClientOptions {
  /**
   * Directory of commands of this bot
   */
  commandDir: string;
  /**
   * Directory of events of this bot
   */
  eventDir: string;
  /**
   * Whether the bot should ignore the command of other bots
   */
  ignoreBots: boolean;
  /**
   * Whether the bot should say the one line alternative for a command with prompted arguments
   */
  sayOneLiner: boolean;
  /**
   * The prefixes that can invoke commands of this bot
   */
  prefixes: string[];
  /**
   * Status messages for status rolling
   * @param client Client for access to data
   */
  statusMessages(client: WovenClient): string[];
}
const defaultOptions: WovenClientOptions = {
  ignoreBots: true,
  sayOneLiner: false,
  commandDir: "/commands",
  eventDir: "/events",
  prefixes: ["!", "."],
  statusMessages: client => [
    Utils.pluralify(
      client.users.cache.filter(user => !user.bot).size,
      `human`
    ) + "!",
    Utils.pluralify(client.guilds.cache.size, `guild`) + "!"
  ]
};

export default class WovenClient extends Client {
  /**
   * Options passed into the client
   */
  public wovenOptions: WovenClientOptions;
  /**
   * The console that the bot will use to log things
   */
  public console: Console;
  /**
   * The handler for commands of this bot
   */
  public commands: CommandHandler;
  /**
   * The handler for events of this bot
   */
  public events: EventHandler;

  /**
   * The client woven for perfection
   * @param options Options for the WovenClient
   * @param discordOptions Options for the Discord.js Client
   */
  constructor(
    options: WovenClientOptions = defaultOptions,
    discordOptions: ClientOptions = { disableMentions: "everyone" }
  ) {
    super(discordOptions);
    this.wovenOptions = Utils.mergeDefault(defaultOptions, options);
    this.console = new Console();
    this.commands = new CommandHandler(this, options.commandDir);
    this.events = new EventHandler(this, options.eventDir);

    this.on("ready", () => {
      this.console.info(`Ready as ${this.user.tag}!`);
      setInterval(() => {
        const statusMessages = this.wovenOptions.statusMessages(this);
        this.user.setPresence({
          activity: {
            name: Utils.getRandom(statusMessages),
            type: "WATCHING"
          },
          afk: false
        });
      }, 30000);
    });
  }
}
