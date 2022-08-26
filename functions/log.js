import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import color from '@heroku-cli/color'
import cli from '@heroku-cli/color'
import {set, ref, onValue, remove, update} from "firebase/database"

export default async function Log(guild, user, event, note) {
    let d = new Date()
    let date = `[${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}]`
    cli.log(cli.color.magneta('this is magneta'))
    console.log(`${date} - ${event}${note ? ` - ${note}` : ``}\nGuild: ${guild.name}(${guild.id})\nUser: ${user !== 'TIO BOT' ? user.username : 'TIO BOT'}(${user !== 'TIO BOT' ? user.id : 'TIO BOT'})\n`)
}