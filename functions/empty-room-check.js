import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default function emptyRoomCheck(oldState, newState) {
    //проверка на емпту рум
    
    if(oldState.channelId !== null) {
        Log(oldState.guild, oldState.member.user, 'Empty room check')
        onValue(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${oldState.channelId}`), async (snapshot) => {
    
            let data = snapshot.val()
            if(data !== null && oldState !== null) {
                    if(oldState.channelId === data.roomChannelId) {
                        try {
                            if(Array.from(oldState.channel.members).length === 0) {
                                oldState.channel.delete()
                                remove(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${oldState.channelId}`))
                            }
                        } catch (error) {
                            
                        }

                    }   
                
            }
        }, {onlyOnce: true})
    }
}