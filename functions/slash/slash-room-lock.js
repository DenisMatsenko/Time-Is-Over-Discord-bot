import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashRoomLock(interaction, options, client) {

  Log(interaction.guild, interaction.user, 'Slash room lock')

  interaction.update('** **')



  let path =  `guilds/${interaction.guildId}/privateRooms/rooms`
  onValue(ref(db, path), (snapshot) => {
    let data = snapshot.val()
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.permissionOverwrites.edit(client.guilds.cache.get(interaction.guildId).roles.everyone.id, { Connect: false })
        } 
      }
    }
  }, {onlyOnce: true})

  // let Embed = new EmbedBuilder()
  // .setColor(0x3a60b5)
  // .setTitle(`Room has been locked.`)
  // .setTimestamp()
  // // .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
  // interaction.reply({ embeds: [Embed], ephemeral: true, })
}