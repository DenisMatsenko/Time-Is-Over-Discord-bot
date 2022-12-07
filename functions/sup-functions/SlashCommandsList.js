import DiscordJS, {EmbedBuilder} from 'discord.js'

export default async function SlashCommandsList(commands)  {
    commands?.create({
        name: 'help',
        description: "show all bot commands.",
    })

    commands?.create({
        name: 'addtest',
        description: "Create test reminder.",
    })
}