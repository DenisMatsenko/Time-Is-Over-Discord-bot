import DiscordJS, {EmbedBuilder} from 'discord.js'

export default async function SlashHelp()  {
    const Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Slash commands only on servers!')
    .setTimestamp()
    .setFooter({ text: 'Time is over', iconURL: 'https://cdn.discordapp.com/attachments/1006251207578361948/1012727195380236308/e2c999dc25c3f9552ec86031eaaffbf6.jpg' });

    interaction.user.send({embeds: [Embed]})
}