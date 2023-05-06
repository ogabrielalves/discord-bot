const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Ouça a melhor playlist de rock!"),

  async execute(interaction) {
    await interaction.reply(
      "https://music.youtube.com/playlist?list=PLHrCIBO-ULBfrqfQZB59ELZg0x-bbjchp"
    );
  },
};
