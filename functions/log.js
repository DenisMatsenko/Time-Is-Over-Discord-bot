import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"

export default async function Log(guild, user, event, note) {
    let d = new Date()
    let date = `[${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}]`
    console.log(`${date} - ${event}${note ? ` - ${note}` : ``} | Guild: ${guild.name}(${guild.id}) | User: ${user !== 'TIO BOT' ? user.username : 'TIO BOT'}(${user !== 'TIO BOT' ? user.id : 'TIO BOT'})\n`)
}