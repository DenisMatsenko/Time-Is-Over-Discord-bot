import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import * as fs from 'fs'
let database = JSON.parse(fs.readFileSync('database.json'))

export default function SlashHit(interaction, options, client) {
    let User = options.getUser('user') 

    // let path = `gifs/hit`
    // onValue(ref(db, path), (snapshot) => {
        let data = database.gifs.hit
        let min = 0
        let max = data.length - 1 

        let randomNum = Math.floor(Math.random() * ((max+1)-min)) + min;

        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ hug`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setDescription(`<@${interaction.user.id}> hit ${User}!`)
        .setImage(`${data[randomNum]}`)
        interaction.reply({  embeds: [Embed] })
    // }, {onlyOnce: true})
}