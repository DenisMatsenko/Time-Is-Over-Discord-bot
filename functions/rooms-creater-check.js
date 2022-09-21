import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import { async } from '@firebase/util'
import * as fs from 'fs'
import WriteDB from './../writeDB.js'

export default async function roomsCreaterCheck(oldState, newState) {
    let database = JSON.parse(fs.readFileSync('database.json'))
    try {
        Log(newState.guild, newState.member.user, 'Rooms creater check')
    } catch (error) {
        console.log("error: ",  error)
    }
    
    //проверка на рум криейт
        let data = database.guilds[newState.guild.id].settings.voiceManageChannel
        if(data !== null) {
            let arr = Object.getOwnPropertyNames(data)
            for (let i = 0; i < arr.length; i++) {
                if(newState.channelId == arr[i]) {



                        const PrivateRoomName = database.guilds[newState.guild.id].members[newState.member.user.id].memberInfo.privateRoomName
                        const channel = await newState.guild.channels.create({ 
                            name: PrivateRoomName,
                            type: 2, 
                            parent: newState.channel.parent,
                            permissionOverwrites: [
                            {
                                id: newState.member.id,
                                allow:  [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            }
                            ]
                        })
                        newState.member.voice.setChannel(channel)

                        console.log(database.guilds[newState.guild.id].privateRooms)
                        if(!database.guilds[newState.guild.id].privateRooms) {
                            Object.assign(database.guilds[newState.guild.id], {privateRooms: {[channel.id]: {roomOwnerId: newState.member.user.id, roomChannelId: channel.id}}})
                        } else {
                            Object.assign(database.guilds[newState.guild.id].privateRooms, {[channel.id]: {roomOwnerId: newState.member.user.id, roomChannelId: channel.id}})
                        }

                        WriteDB(database)
    
                        // set(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${channel.id}`), {
                        //     roomOwnerId: newState.member.user.id,
                        //     roomChannelId: channel.id
                        // })
                }
            }
            
        } 
}