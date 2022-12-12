import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"
import { v4 } from 'uuid';



export default async function SlashShowAllTests(interaction, options, client)  {


    let Embed = new EmbedBuilder()
    .setTitle(`All tests:`)
    //.setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
    interaction.reply({  embeds: [Embed] })

    onValue(ref(db, 'database'), (snapshot) => { 
        //console.log(snapshot.val())
        const data = snapshot.val()

        //Object.keys(data).length


        //console.log(Object.entries(data)[0][1])
        for (let i = 0; i < Object.keys(data).length; i++) {

            let testData = Object.entries(data)[i][1]
            let Embed = new EmbedBuilder()
            .setTitle(`${testData['test-date']} - ${testData['test-subject']}`)
            .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)

            //.setAuthor({name: `Created by ${testData['created-by-name']}` , iconURL: testData['created-by-pfp']})

            //.setAuthor()
            //.setTimestamp()
        
            interaction.channel.send({  embeds: [Embed] })
            //console.log(Object.entries(data)[i]) 
        }
        
    }, {onlyOnce: true})



    

}