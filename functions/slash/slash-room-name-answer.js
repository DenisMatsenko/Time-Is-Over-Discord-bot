import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js';
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'


export default async function roomNameAnswer(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Room name answer')


  interaction.update('** **')

  let answer = interaction.fields.getTextInputValue('roomname');

  let database = JSON.parse(fs.readFileSync('database.json'))
  // let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`
  database.guilds[interaction.guildId].members[interaction.user.id].memberInfo.privateRoomName = answer
  WriteDB(database)
  // update(ref(db, path), {
  //   privateRoomName: answer 
  // })


  // path =  `guilds/${interaction.guildId}/privateRooms/rooms`
  
  // onValue(ref(db, path), (snapshot) => {
    let data = database.guilds[interaction.guildId].privateRooms
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.setName(answer)
        }
      }
    }
  // }, {onlyOnce: true})
}