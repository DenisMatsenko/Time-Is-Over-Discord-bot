import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"
import { v4 } from 'uuid';

const Day = [
    "Today",
    "Tomorrow",
    "In 2 days",
    "In 3 days",
    "In 4 days",
    "In 5 days",
    "In 6 days",
]

export default async function SendTestListToChannel(client)  {

        onValue(ref(db), (snapshot) => { 

            const data = snapshot.val().database
            const settings = snapshot.val().Settings
    


            //new
            for (let i = 0; i <= 7; i++) {
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
