import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import sendEmnbed from './sendEmbed.js'

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
                                        Log(client.guilds.cache.get(guildsArr[i]), 'TIO BOT', 'Role is over',  trarr[y].split('.')[2])
                                        
                                        console.log(client.guilds.cache.get(guildsArr[i]).roles.cache.get(trarr[y].split('.')[1]).name)
                                        // sendEmnbed({
                                        //     color: 'blue',
                                        //     thumbnail: client.guilds.cache.get(guildsArr[i]).iconURL(),
                                
                                        //     russianTitle:`Временная роль закончилась.`,
                                        //     russianDescription: `Временная роль **«${client.guilds.cache.get(guildsArr[i]).roles.cache.get(trarr[y].split('.')[1]).name}»** закончилась на сервере **${client.guilds.cache.get(guildsArr[i]).name}**!`,
                                        //     russianFields: [],
                                
                                        //     englishTitle: `Role has been removed.`,
                                        //     englishDescription: `Hello. Your time role **«${client.guilds.cache.get(guildsArr[i]).roles.cache.get(trarr[y].split('.')[1]).name}»** has been removed on the **${client.guilds.cache.get(guildsArr[i]).name}**!`,
                                        //     englishFields: [],
                                
                                        //     author: null,
                                        //     //timestamp: true,
                                        //     footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                                
                                        //     guildId: client.guilds.cache.get(guildsArr[i]),
                                        //     feedback: {
                                        //       type: 'send',
                                        //     //   add: {client: client, guildId: },
                                        //       path: client.guilds.cache.get(guildsArr[i]).members.fetch('538343406326513704'),
                                        //       ephemeral: false
                                              
                                        //     },
                                        //   })

                                        sendEmnbed({
                                            color: 'blue',
                                            thumbnail: null,
                                    
                                            russianTitle:`Временная роль закончилась.`,
                                            russianDescription: null,
                                            russianFields: [],
                                    
                                            englishTitle: `Role has been removed.`,
                                            englishDescription: null,
                                            englishFields: [],
                                    
                                            author: null,
                                            //timestamp: true,
                                            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                                    
                                            guildId: guildsArr[i], 
                                            feedback: {
                                              type: 'send',
                                              add: {client: client, guildId: guildsArr[i], memId: trarr[y].split('.')[2]},
                                              path: 'path',
                                              ephemeral: false
                                            },
                                          }) 
                                    } 
                                }
                
                        }
                    }
                } 
            }, {onlyOnce: true})
}