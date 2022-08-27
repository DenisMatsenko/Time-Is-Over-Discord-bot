import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default function SlashWallet(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash wallet')
    onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`), (snapshot) => {
        let data = snapshot.val();
        if(data.coins !== null) {
            let Embed = new EmbedBuilder()
            .setColor(0x3a60b5)
            .setAuthor({ name: `${interaction.user.username} ▪ wallet`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
            .setTitle(`**Coins**: ${data.coins}`)
            // .setTimestamp()
            // .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({  embeds: [Embed] }) 
        }
      }, {
        onlyOnce: true
      })
}