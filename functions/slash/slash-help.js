import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'


export default async function SlashHelp(interaction, options, client)  {

    let Embed = new EmbedBuilder()
    .setTitle('Bot commands!')
    .setDescription(
        '**/add-test** - Add test to test list.\n' + 
        '**/show-all-tests** - Write list of tests.\n'
    )
    .setTimestamp()

    interaction.reply({  embeds: [Embed] })
}