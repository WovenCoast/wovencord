import { Command } from "../../../src/all";
import { Message } from "discord.js";

export default class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      aliases: ["h"]
    });
  }
  async exec(msg: Message, args: string[]) {}
}
