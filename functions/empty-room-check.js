import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import * as fs from 'fs'
import WriteDB from './../writeDB.js'

export default function emptyRoomCheck(oldState, newState) {
    //проверка на емпту рум

    let database = JSON.parse(fs.readFileSync('database.json'))
    
    if(oldState.channelId !== null) {
        Log(oldState.guild, oldState.member.user, 'Empty room check')
    
            let data = database.guilds[newState.guild.id].privateRooms[oldState.channelId]
            if(data && oldState !== null) {
                    if(oldState.channelId === data.roomChannelId) {
                        try {
                            if(Array.from(oldState.channel.members).length === 0) {
                                oldState.channel.delete()
                                delete database.guilds[newState.guild.id].privateRooms[oldState.channelId]
                                WriteDB(database)
                                // remove(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${oldState.channelId}`))
                            }
                        } catch (error) {
                            
                        }

                    }   
                
            }
    }
}