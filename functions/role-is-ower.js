import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default async function roleIsOwer(client) {
            onValue(ref(db, `guilds`), async (snapshot) => {
                let data = snapshot.val()
                let guildsArr = Object.keys(data)

                for (let i = 0; i < guildsArr.length; i++) {
                    if(data[guildsArr[i]].timeRoles) {
                        let trarr = data[guildsArr[i]].timeRoles
                        for (let y = 0; y < trarr.length; y++) {

                                let d =  new Date()
                                let timeNow = (d.getFullYear()*525960 +  d.getMonth() * 43800 + (d.getDate()) * 1440 + d.getHours() * 60 + d.getMinutes())
 
                                if(trarr[y]) {
                                    if(parseInt(trarr[y].split('.')[0]) < timeNow) {
                                        try {
                                            if(client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2])) {
                                                client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).roles.remove(trarr[y].split('.')[1])
                                                
                                            }      
                                        } catch (error) {
                                            Log(client.guilds.cache.get(guildsArr[i]), client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).user, 'Role is over', 'CRASHED')
                                        }
                                        
        
                                        remove(ref(db, `guilds/${guildsArr[i]}/timeRoles/${y}`))
                                        Log(client.guilds.cache.get(guildsArr[i]), client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).user, 'Role is over', 'role removed')
        
                                        let Embed = new EmbedBuilder()
                                        .setColor(0x3a60b5)
                                        // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                                        .setTitle(`Role has been removed`)
                                        .setDescription(`Hello. Your time role **«${client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).roles.cache.get(trarr[y].split('.')[1]).name}»** has been removed on the **${client.guilds.cache.get(guildsArr[i]).name}**!`)
                                        .setThumbnail(client.guilds.cache.get(guildsArr[i]).iconURL())
                                        .setTimestamp()
                                        .setFooter({ text: `Time is over from ${client.guilds.cache.get(guildsArr[i]).name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                                    
                                        client.users.cache.get(client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).id).send({ embeds: [Embed] })    
                                    } 
                                }
                
                        }
                    }
                } 
            }, {onlyOnce: true})
}