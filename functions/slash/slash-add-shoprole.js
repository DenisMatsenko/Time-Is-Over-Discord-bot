import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashAddShopRole(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash add role to shop')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const role = options.getRole('role')
        const time = options.getInteger('time')
        const price = options.getInteger('price')
    
        onValue(ref(db, `guilds/${interaction.guildId}/shop`), (snapshot) => {
            let data = snapshot.val()
            let index = 0
            if(data !== null) index = data.length
    
            update(ref(db, `guilds/${interaction.guildId}/shop`), {
                [index]: `${role.id}.${time}.${price}`
            })
        }, {onlyOnce: true})

        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`Added.`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true})
    } else {
        let Embed = new EmbedBuilder()
        .setColor(0xbd3c3c)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`You are not an administrator!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true })
    }
}