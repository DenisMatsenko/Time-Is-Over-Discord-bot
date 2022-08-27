import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashRoomLimit(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Slash room limit')
  const limit = options.getInteger('limit') 

  let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`
  update(ref(db, path), {
    privateRoomLimit: limit <= 99 ? limit : 99 
  })


  path =  `guilds/${interaction.guildId}/privateRooms/rooms`
  onValue(ref(db, path), (snapshot) => {
    let data = snapshot.val()
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.setUserLimit(limit <= 99 ? limit : 99)
        }
      }
    }
  }, {onlyOnce: true})

  let Embed = new EmbedBuilder()
  .setColor(0x3a60b5)
  .setTitle(`Room limit has been changed to ${limit <= 99 ? limit : 99}.`)
  .setTimestamp()
  .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
  interaction.reply({ embeds: [Embed], ephemeral: true, })
}