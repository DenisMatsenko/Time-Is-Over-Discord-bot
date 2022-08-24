import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlasSendMsg(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash seng msg')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const title = options.getString('title')
        const description = options.getString('description')
        const image = options.getString('image')

        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        .setTitle(title)
        .setDescription(description)
        .setImage(image)

        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
        interaction.channel.send({  embeds: [Embed], ephemeral: true})
    } else {
        let Embed = new EmbedBuilder()
        .setColor(0xbd3c3c)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`You are not an administrator!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true })
    }
}