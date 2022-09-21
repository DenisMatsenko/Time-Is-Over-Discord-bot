import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

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
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.channel.send({  embeds: [Embed], ephemeral: true})
    } else {
        sendEmnbed({
            color: 'red',
            thumbnail: null,
    
            russianTitle: `Вы не администратор!`,
            russianDescription: null,
            russianFields: [],
    
            englishTitle: `You are not an administrator!`,
            englishDescription: null,
            englishFields: [],
    
            author: null,                            
            // timestamp: 'true',
            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
    
            guildId: interaction.guildId,
            feedback: {
              type: 'reply',
              path: interaction,
              ephemeral: false,
            },
        })
    }
    
}