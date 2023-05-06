const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");

// DotEnv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN } = process.env;

// Importação dos comandos
const fs = require("fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `Esse comando em ${filePath} está com "data" ou "execute ausentes"`
    );
  }
}

// Login do BOT
client.once(Events.ClientReady, (c) => {
  console.log(`Pronto! Login realizado como ${c.user.tag}`);
});

client.login(TOKEN);

// Listener de interações com o BOT
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const selected = interaction.values[0];
    let documentation = "";

    switch (selected) {
      case "javascript":
        documentation =
          "Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript";
        break;
      case "python":
        documentation = "Documentação do Python: https://docs.python.org/3/";
        break;
      case "csharp":
        documentation =
          "Documentação do C#: https://learn.microsoft.com/pt-br/dotnet/csharp/";
        break;
      case "discordjs":
        documentation =
          "Documentação do discord.js: https://discord.js.org/docs/packages/core/0.6.0";
        break;
    }
    await interaction.reply(documentation);
  }

  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error("Comando não encontrado");
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply("Houve um erro ao executar esse comando!");
  }
});
