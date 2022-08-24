import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js';

export default async function roomNameAnswer(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Room name answer')
  let answer = interaction.fields.getTextInputValue('roomname');

  let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`
  update(ref(db, path), {
    privateRoomName: answer 
  })


  path =  `guilds/${interaction.guildId}/privateRooms/rooms`
  onValue(ref(db, path), (snapshot) => {
    let data = snapshot.val()
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.setName(answer)
        }
      }
    }
  }, {onlyOnce: true})

  let Embed = new EmbedBuilder()
  .setColor(0x3a60b5)
  .setTitle(`Room name has been changed to ${answer}`)
  .setTimestamp()
  .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
  interaction.reply({ embeds: [Embed], ephemeral: true, })
}