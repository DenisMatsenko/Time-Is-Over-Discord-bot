import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "../../firebase.js"
import { v4 } from 'uuid';



export default async function SlashShowAllTests(interaction, options, client)  {
    let Embed = new EmbedBuilder()
    .setTitle(`All tests:`)
    interaction.reply({  embeds: [Embed] })

    onValue(ref(db, 'database'), (snapshot) => { 
        const data = snapshot.val()

        for (let i = 0; i < Object.keys(data).length; i++) {

            let testData = Object.entries(data)[i][1]
            let Embed = new EmbedBuilder()
            .setTitle(`${testData['test-date']} - ${testData['test-subject']}`)
            .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
        
            interaction.channel.send({  embeds: [Embed] })
        }
        
    }, {onlyOnce: true})



    

}