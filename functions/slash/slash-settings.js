import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default function SlashSettings(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash settings')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {


    const settings = {
        voiceManageChannel: options.getChannel('voice-manage-channel') !== null ? options.getChannel('voice-manage-channel').id : options.getChannel('voice-manage-channel'),
        pointPerMinute: options.getNumber('point-per-minute'),
        pointPerMsg: options.getNumber('point-per-message'),
        chanceCrime: options.getNumber('chance-to-crime'),
        crimeGetMax: options.getNumber('crime-max'),
        crimeGetMin: options.getNumber('crime-min'),
        crimeLostMin: options.getNumber('crime-lost-min'),
        crimeLostMax: options.getNumber('crime-lost-max'),
        workGetMax: options.getNumber('work-max'),
        workGetMin: options.getNumber('work-min'),
    }


    let arr = Object.getOwnPropertyNames(settings)
    
    for (let i = 0; i < arr.length; i++) {
        if(settings[arr[i]] !== null) {
            update(ref(db, `guilds/${interaction.guild.id}/settings`), {
                [arr[i]]: settings[arr[i]]
            })
        }
    }








    let Embed = new EmbedBuilder()
    .setColor(0x3a60b5)
    .setTitle(`Settings has been changed!`)
    .setDescription(`Use settings review.`)
    .setTimestamp()
    // .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
    interaction.reply({ embeds: [Embed], ephemeral: true })
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