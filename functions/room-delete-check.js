import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import * as fs from 'fs'
import WriteDB from './../writeDB.js'

export default function RoomDeleteCheck(channel) {
    //проверка на емпту рум
    let database = JSON.parse(fs.readFileSync('database.json'))
            let data = database.guilds[channel.guild.id].privateRooms[channel.id]
            console.log(data)
            if(data) {
                if(channel.id === data.roomChannelId) {
                    delete database.guilds[channel.guild.id].privateRooms[channel.id]
                    WriteDB(database)
                    Log(channel.guild, "TIO BOT", 'Room delete check', 'DELETED')
                }
            }

}