import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"

export default function SlashCry(interaction, options, client) {
    let path = `gifs/cry`
    onValue(ref(db, path), (snapshot) => {
        let data = snapshot.val()
        let min = 0
        let max = data.length - 1 

        let randomNum = Math.floor(Math.random() * ((max+1)-min)) + min;

        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ hug`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setDescription(`<@${interaction.user.id}> is crying.`)
        .setImage(`${data[randomNum]}`)
        interaction.reply({  embeds: [Embed] })
    }, {onlyOnce: true})
}