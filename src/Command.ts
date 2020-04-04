import WovenClient from "./Client";
import { Message } from "discord.js";

interface CommandOptions {
  /**
   * The name of the command
   */
  name: string;
  /**
   * Aliases that will invoke this command
   */
  aliases: string[];
}
export default abstract class Command {
  /**
   * The client associated to this command
   */
  public client: WovenClient;
  /**
   * The options passed into the command
   */
  public options: CommandOptions;
  /**
   * The name of this command
   */
  public name: string;
  /**
   * The category of the command, not accessible in constructor
   */
  public category: string;

  [key: string]: any;

  /**
   * A command
   * @param client Client associated with this command
   * @param options Options passed into the command
   */
  constructor(client, options: CommandOptions) {
    this.client = client;
    this.options = options;
    this.name = options.name;
  }

  /**
   * The execute function to execute this command
   * @param msg Message for ease of access to related things
   * @param args Arguments that the user provided to the command with its invoke
   */
  abstract async exec(msg: Message, args: string[]): Promise<void>;
}
