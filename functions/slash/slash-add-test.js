import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'


export default async function SlashAddTest(interaction, options, client)  {

    let Embed = new EmbedBuilder()
    .setTitle('Time is over turned on!')
    .setThumbnail(client.user.avatarURL())
    .setAuthor({name: `${client.user.username} ▪ Turn on`, iconURL: client.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q'})
    .setTimestamp()

    interaction.reply({  embeds: [Embed] })
}