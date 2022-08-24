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
 
                            if(parseInt(trarr[y].split('.')[0]) < timeNow) {
                                try {
                                    if(client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2])) {
                                        client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).roles.remove(trarr[y].split('.')[1])
                                        Log(client.guilds.cache.get(guildsArr[i]), client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).user, 'Role is over', 'role removed')
                                    }      
                                } catch (error) {
                                    Log(client.guilds.cache.get(guildsArr[i]), client.guilds.cache.get(guildsArr[i]).members.cache.get(trarr[y].split('.')[2]).user, 'Role is over', 'CRASHED')
                                }
                                
                                // // console.log(client.guilds.cache.get(guildsArr[i]).members.fetch(trarr[y].split('.')[2]))


                                // const guild = client.guilds.cache.get(guildsArr[i]);
                                // let member = guild.members.cache.get(trarr[y].split('.')[2]);

                                // console.log("guild: ",  guild.name)
                                // console.log("member: ",  member)

                                // member.removeRole(trarr[y].split('.')[1])
                                // .catch(console.error);


                                // client.guilds.cache.get(guildsArr[i]).members.fetch(trarr[y].split('.')[2]).removeRole(trarr[y].split('.')[1])
                                // .catch(console.error)
                                remove(ref(db, `guilds/${guildsArr[i]}/timeRoles/${y}`))

                            }                 
                        }
                    }
                } 
            }, {onlyOnce: true})
}