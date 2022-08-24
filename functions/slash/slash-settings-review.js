import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default function SlashSettingsReview(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash settings review')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

        onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
            let data = snapshot.val()
            let arr = Object.getOwnPropertyNames(data)
            let strresult = ``

            for (let i = 0; i < arr.length; i++) {
                if(arr[i] == 'voiceManageChannel') {
                    strresult += `${arr[i]} - <#${data[arr[i]]}>.\n`
                } else {
                    strresult += `${arr[i]} - ${data[arr[i]]}.\n`
                }

            }

            let Embed = new EmbedBuilder()
            .setColor(0x3a60b5)
            .setTitle(`Settings review.`)
            .setDescription(`${strresult}`)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
            interaction.reply({ embeds: [Embed], ephemeral: true })


        }, {onlyOnce: true})     

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