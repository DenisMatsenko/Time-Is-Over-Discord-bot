import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import { async } from '@firebase/util'

export default async function roomsCreaterCheck(oldState, newState) {
    Log(newState.guild, newState.member.user, 'Rooms creater check')
    //проверка на рум криейт
    onValue(ref(db, `guilds/${newState.guild.id}/settings`), async (snapshot) => {
        let data = snapshot.val()
        if(data.voiceManageChannel !== "none") {
            if(newState.channelId == data.voiceManageChannel) {
                onValue(ref(db, `guilds/${newState.guild.id}/members/${newState.member.user.id}/memberInfo`), async (snapshot) =>  {
                    const PrivateRoomName = snapshot.val().privateRoomName
                    const PrivateRoomStat = snapshot.val().privateRoomStat
                    const PrivateRoomLimit = snapshot.val().privateRoomLimit
                    const channel = await newState.guild.channels.create({ 
                        name: PrivateRoomName,
                        type: 2, 
                        parent: newState.channel.parent,
                        permissionOverwrites: [{
                            id: newState.guild.roles.everyone,
                            [PrivateRoomStat === 'lock' ? 'deny' : 'allow']: [PermissionsBitField.Flags.Connect],      
                        },
                        {
                            id: newState.member.id,
                            allow:  [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                        }
                        ]
                    })
                    channel.setUserLimit(PrivateRoomLimit)
        
                    newState.member.voice.setChannel(channel)

                    set(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${channel.id}`), {
                        roomOwnerId: newState.member.user.id,
                        roomChannelId: channel.id
                    })
     
                }, {onlyOnce: true})
            }
        } 
    }, {onlyOnce: true})
}