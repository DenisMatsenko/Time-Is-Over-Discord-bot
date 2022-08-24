import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default function calcVoiceTime(oldMember, newMember, d, client) {
        if(oldMember.channelId == null && newMember.channelId !== null) {
            if(client.guilds.cache.get(newMember.guild.id).afkChannelId !== newMember.channelId) {
                let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
    
                update(ref(db, path), {
                    voiseChatConnectionTime: `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`,
                    voiseChatDisConnectionTime: 'none'
                })
            }
        }
        else if(oldMember.channelId !== null && newMember.channelId !== null) {
            if(client.guilds.cache.get(newMember.guild.id).afkChannelId === newMember.channelId) {

                let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
    
                onValue(ref(db, path), (snapshot) => { 
                    let data = snapshot.val();
                    let diffrence = 0
                    if(data.voiseChatConnectionTime !== 'none') {
                        let temp = data.voiseChatConnectionTime
                            let oldHours = temp.split(':')[0]
                            let oldMinutes  = temp.split(' ')[0].split(':')[1]
                            let oldDays = temp.split(' ')[1].split('.')[0]
                            let oldMonth = temp.split(' ')[1].split('.')[1]
                            let oldYears = temp.split(' ')[1].split('.')[2]
            
                            let oldDate = (parseInt(oldYears)* 525960 + (parseInt(oldMonth)-1)*43800 + parseInt(oldDays)*1440 + parseInt(oldHours)*60 + parseInt(oldMinutes))
                            let newDate = (d.getFullYear()*525960 +  d.getMonth() * 43800 + d.getDate() * 1440 + d.getHours() * 60 + d.getMinutes())
                            
                            diffrence = newDate-oldDate
                    }
        
        
                        update(ref(db, path), {
                            timeInVoiceChat: data.timeInVoiceChat + diffrence,
                            voiseChatConnectionTime: 'none',
                            voiseChatDisConnectionTime:  `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`
                        })
    
                        Log(oldMember.guild, oldMember.member.user, 'Calc voice time', diffrence)
                  }, {
                    onlyOnce: true
                  })
            } else if(client.guilds.cache.get(newMember.guild.id).afkChannelId === oldMember.channelId && newMember.channelId !== null) {
                let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
    
                update(ref(db, path), {
                    voiseChatConnectionTime: `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`,
                    voiseChatDisConnectionTime: 'none'
                })
            }
        }
        else if(oldMember.channelId !== null && newMember.channelId == null) {
     
            let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
    
            onValue(ref(db, path), (snapshot) => { 
                let data = snapshot.val();
                let diffrence = 0
                if(data.voiseChatConnectionTime !== 'none') {
                    let temp = data.voiseChatConnectionTime
                        let oldHours = temp.split(':')[0]
                        let oldMinutes  = temp.split(' ')[0].split(':')[1]
                        let oldDays = temp.split(' ')[1].split('.')[0]
                        let oldMonth = temp.split(' ')[1].split('.')[1]
                        let oldYears = temp.split(' ')[1].split('.')[2]
        
                        let oldDate = (parseInt(oldYears)* 525960 + (parseInt(oldMonth)-1)*43800 + parseInt(oldDays)*1440 + parseInt(oldHours)*60 + parseInt(oldMinutes))
                        let newDate = (d.getFullYear()*525960 +  d.getMonth() * 43800 + d.getDate() * 1440 + d.getHours() * 60 + d.getMinutes())
                        
                        diffrence = newDate-oldDate
                }
    
    
                    update(ref(db, path), {
                        timeInVoiceChat: data.timeInVoiceChat + diffrence,
                        voiseChatConnectionTime: 'none',
                        voiseChatDisConnectionTime:  `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`
                    })

                    Log(oldMember.guild, oldMember.member.user, 'Calc voice time', diffrence)
              }, {
                onlyOnce: true
              })
        }
    }