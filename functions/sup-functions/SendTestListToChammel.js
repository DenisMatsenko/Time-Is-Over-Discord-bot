import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"
import { v4 } from 'uuid';



export default async function SendTestListToChannel(client)  {


    


    // let Embed = new EmbedBuilder()
    // .setTitle(`Tomorrow }`)

    // // //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
    // //client.users.fetch('538343406326513704').then((user) => {user.send({ embeds: [Embed] })})
    




        //console.log( client.guilds.cache.get('1006001493834465321'))
        //console.log('hi')
    
        onValue(ref(db, 'database'), (snapshot) => { 
            //console.log(snapshot.val())
            const data = snapshot.val()
    
            for (let i = 0; i < Object.keys(data).length; i++) {
    
                let testData = Object.entries(data)[i][1]

                console.log("testData: ",  testData)
    
                //console.log('hi')
                //1006001494530736229
                //interaction.channel.send({  embeds: [Embed] })
                //console.log(parseInt(testData['test-date'].split('.')[0]));
                //console.log(new Date().getDate() + 1)

                if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate() + 3) {
                    let Embed = new EmbedBuilder()
                    .setTitle(`After 3 days - ${testData['test-subject']}`)
                    .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                    //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                    client.guilds.cache.get('919660235604508772').channels.cache.get('919660235604508774').send({ embeds: [Embed] })
                }

                if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate() + 2) {
                    let Embed = new EmbedBuilder()
                    .setTitle(`After 2 days - ${testData['test-subject']}`)
                    .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                    //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                    client.guilds.cache.get('919660235604508772').channels.cache.get('919660235604508774').send({ embeds: [Embed] })
                }
    
    
                if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate() + 1) {
                    let Embed = new EmbedBuilder()
                    .setTitle(`Tomorrow - ${testData['test-subject']}`)
                    .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                    //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                    client.guilds.cache.get('919660235604508772').channels.cache.get('919660235604508774').send({ embeds: [Embed] })
                }

                if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate()) {
                    let Embed = new EmbedBuilder()
                    .setTitle(`Today - ${testData['test-subject']}`)
                    .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                    //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                    client.guilds.cache.get('919660235604508772').channels.cache.get('919660235604508774').send({ embeds: [Embed] })
                }
            }
            
        }, {onlyOnce: true})
    
    
}