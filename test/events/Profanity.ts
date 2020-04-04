import Event from "../../src/Event";
import { Message } from "discord.js";

export default class TestEvent extends Event {
  constructor(client) {
    super(client, {
      name: "Profanity",
      eventName: "message"
    });
    this.profanity = ["butter"];
  }
  async exec(message: Message) {
    if (this.profanity.includes(message.content.toLowerCase())) {
      message.delete();
      message.channel.send(`${message.author.toString()} no no bad boi`);
    }
  }
}
