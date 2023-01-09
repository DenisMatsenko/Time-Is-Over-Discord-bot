import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"
import { v4 } from 'uuid';

const Day = [
    "Today",
    "Tomorrow",
    "Afte 2 days",
    "Afte 3 days",
]

export default async function SendTestListToChannel(client)  {


    


    // let Embed = new EmbedBuilder()
    // .setTitle(`Tomorrow }`)

    // // //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
    // //client.users.fetch('538343406326513704').then((user) => {user.send({ embeds: [Embed] })})
    




        //console.log( client.guilds.cache.get('1006001493834465321'))
        //console.log('hi')
    
        onValue(ref(db), (snapshot) => { 
            //console.log(snapshot.val())
            const data = snapshot.val().database
            const settings = snapshot.val().Settings
    
            //old
            // for (let i = 0; i < Object.keys(data).length; i++) {
    
            //     let testData = Object.entries(data)[i][1]

            //     console.log("testData: ",  testData)
    
            //     //console.log('hi')
            //     //1006001494530736229
            //     //interaction.channel.send({  embeds: [Embed] })
            //     //console.log(parseInt(testData['test-date'].split('.')[0]));
            //     //console.log(new Date().getDate() + 1)
                
            //     for (let i = 0; i <= 3; i++) {
                    // if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate() + i && ) {
                    //     let Embed = new EmbedBuilder()
                    //     .setTitle(`${Day[i]} - ${testData['test-subject']}`)
                    //     .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                    //     //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                    //     client.guilds.cache.get(settings.ServerID).channels.cache.get(settings.ChannelID).send({ embeds: [Embed] })
                    // }
            //     }
            // }

            //new
            for (let i = 0; i <= 3; i++) {
                for (let y = 0; y < Object.keys(data).length; y++) {

                    let testData = Object.entries(data)[y][1]

                    if(parseInt(testData['test-date'].split('.')[0]) == new Date().getDate() + i) {
                        let Embed = new EmbedBuilder()
                        .setTitle(`${Day[i]} - ${testData['test-subject']}`)
                        .setDescription(`${testData['test-topic']}. Created by <@${testData['created-by-id']}>`)
                        //client.channels.cache.get('1006001494530736229').send({  embeds: [Embed] });
                        client.guilds.cache.get(settings.ServerID).channels.cache.get(settings.ChannelID).send({ embeds: [Embed] })
                    }
                }
            }
            
        }, {onlyOnce: true})
    
    
}
