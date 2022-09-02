import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

export default function SlashWallet(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash wallet')

    onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`), (snapshot) => {
        let data = snapshot.val();
        if(data.coins !== null) {
          sendEmnbed({
            color: 'blue',
            thumbnail: null,

            russianTitle: `**Коины**: ${data.coins}`,
            russianDescription: null,
            russianFields: [],

            englishTitle: `**Coins**: ${data.coins}`,
            englishDescription: null,
            englishFields: [],

            author: {name: `${interaction.user.username} ▪ Wallet`, iconURL: interaction.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q'},
            timestamp: null,
            footer: null,

            guildId: interaction.guildId,
            feedback: {
              type: 'reply',
              path: interaction,
              ephemeral: false
            },
          })
        }
      }, {
        onlyOnce: true
      })
}