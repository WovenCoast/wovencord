import { Command, Utils } from "../../src/all";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      aliases: ["pong"]
    });
  }
  async exec(msg: Message, args: string[]) {
    msg.channel.send(
      `:ping_pong: Pong! ${Utils.convertMs(this.client.ws.ping)}`
    );
  }
}
