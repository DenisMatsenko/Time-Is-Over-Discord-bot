import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default function SlashRoomUnlock(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Slash room unlock')

  let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`
  update(ref(db, path), {
    privateRoomStat: "unlock"
  })


  path =  `guilds/${interaction.guildId}/privateRooms/rooms`
  onValue(ref(db, path), (snapshot) => {
    let data = snapshot.val()
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.permissionOverwrites.edit(client.guilds.cache.get(interaction.guildId).roles.everyone.id, { Connect: true })
        }
      }
    }
  }, {onlyOnce: true})

  let Embed = new EmbedBuilder()
  .setColor(0x3a60b5)
  .setTitle(`Room has been unlocked.`)
  .setTimestamp()
  .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
  interaction.reply({ embeds: [Embed], ephemeral: true, })
}