import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

export default async function SlashActive(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash active')
    onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), (snapshot) => {
        let data = snapshot.val();
        if(data !== null) {

          sendEmnbed({
            color: 'blue',
            thumbnail: interaction.user.avatarURL(),

            russianTitle: null,
            russianDescription: `
            Текстовые сообщения - ${data.countOfTextMessages}
            Время в чате(мин) - ${data.timeInVoiceChat}
            Очки активности - ${data.countOfActivityPoints}
            `,
            russianFields: [],

            englishTitle: null,
            englishDescription: `
            Text messages - ${data.countOfTextMessages}
            Voice minutes - ${data.timeInVoiceChat}
            Activity points - ${data.countOfActivityPoints}
            `,
            englishFields: [],

            author: { name: `${interaction.user.username} ▪ Activity`, iconURL: interaction.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q.' },
            // timestamp: 'true',
            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },

            guildId: interaction.guildId,
            feedback: {
              type: 'reply',
              path: interaction,
              ephemeral: false,
            },
          })

            // let Embed = new EmbedBuilder()
            // // .setColor(0x3a60b5)
            // // .setAuthor({ name: `${interaction.user.username} ▪ Activity`, iconURL: interaction.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q.' })
            // .addFields(
            //     { name: 'Text messages:',    value: `${data.countOfTextMessages}`, inline: true },
            //     { name: 'Voice minutes:',    value: `${data.timeInVoiceChat}`, inline: true },
            //     { name: 'Activity points:',    value: `${data.countOfActivityPoints}`, inline: true },
            // )
            // .setTimestamp()
            // .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
            // interaction.reply({  embeds: [Embed] })
        }
      }, {
        onlyOnce: true
      })
}