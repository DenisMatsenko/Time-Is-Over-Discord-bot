import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import * as fs from 'fs'

export default async function SlashRoomUnlock(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Slash room unlock')

  interaction.update('** **')


  let database = JSON.parse(fs.readFileSync('database.json'))
  // let path =  `guilds/${interaction.guildId}/privateRooms/rooms`
    let data = database.guilds[interaction.guildId].privateRooms
    if(data !== null) {
      let obj = Object.getOwnPropertyNames(data)

      for (let i = 0; i < obj.length; i++) {
        if(data[obj[i]].roomOwnerId === interaction.user.id) {
          const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(data[obj[i]].roomChannelId)
          channel.permissionOverwrites.edit(client.guilds.cache.get(interaction.guildId).roles.everyone.id, { Connect: true })
        }
      }
    }
} 