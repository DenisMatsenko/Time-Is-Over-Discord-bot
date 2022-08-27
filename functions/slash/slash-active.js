import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashActive(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash active')
    onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), (snapshot) => {
        let data = snapshot.val();
        if(data.coins !== null) {

            let Embed = new EmbedBuilder()
            .setColor(0x3a60b5)
            .setAuthor({ name: `${interaction.user.username} ▪ activity`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
            .addFields(
                { name: 'Text messages:',    value: `${data.countOfTextMessages}`, inline: true },
                { name: 'Voice minutes:',    value: `${data.timeInVoiceChat}`, inline: true },
                { name: 'Activity points:',    value: `${data.countOfActivityPoints}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({  embeds: [Embed] })
        }
      }, {
        onlyOnce: true
      })
}