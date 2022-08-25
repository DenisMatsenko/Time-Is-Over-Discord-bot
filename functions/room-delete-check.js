import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default function RoomDeleteCheck(channel) {
    //проверка на емпту рум
        onValue(ref(db, `guilds/${channel.guild.id}/privateRooms/rooms/${channel.id}`), async (snapshot) => {
            let data = snapshot.val()
            if(data !== null) {
                if(channel.id === data.roomChannelId) {
                    remove(ref(db, `guilds/${channel.guild.id}/privateRooms/rooms/${channel.id}`))
                    Log(channel.guild, "TIO BOT", 'Room delete check', 'DELETED')
                }
            }
        }, {onlyOnce: true})
}