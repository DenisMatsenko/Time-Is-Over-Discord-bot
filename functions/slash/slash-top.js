import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from './../../writeDB.js'



export default function SlashTop(interaction, options, client) {
    let database = JSON.parse(fs.readFileSync('database.json'))
    Log(interaction.guild, interaction.user, 'Slas top')
    // let TopCoun = options.getNumber('number') 
    let TopCoun = 15
    // let path = `guilds/${interaction.guild.id}/members`

    
    // onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
        const pointPerMsg = database.guilds[interaction.guild.id].settings.pointPerMsg
        const pointPerMinute = database.guilds[interaction.guild.id].settings.pointPerMinute
        const referalPoints = database.guilds[interaction.guild.id].settings.referalPoints
    

    // onValue(ref(db, path), (snapshot2) => { 
        let date = database.guilds[interaction.guild.id].members
        let MemberNamesArr = Object.getOwnPropertyNames(date)


        const calcOwnPoints = (name) => {
            for (let i = 0; i < MemberNamesArr.length; i++) {
                let path = `guilds/${interaction.guild.id}/members/${MemberNamesArr[i]}/memberInfo`
                
                // onValue(ref(db, path), (snapshot) => { 
                    let date = database.guilds[interaction.guild.id].members[MemberNamesArr[i]].memberInfo
                    
                    database.guilds[interaction.guild.id].members[MemberNamesArr[i]].memberInfo.countOfActivityPoints = Math.round(date.countOfTextMessages*pointPerMsg + date.timeInVoiceChat*pointPerMinute)
                    WriteDB(database)
                    // update(ref(db, path), {
                    //     countOfActivityPoints: Math.round(date.countOfTextMessages*pointPerMsg + date.timeInVoiceChat*pointPerMinute)
                    // })
                // }, {onlyOnce: true})
            }
        }

        const calcRefPoints = (name) => {   
            for (let i = 0; i < MemberNamesArr.length; i++) {
                // let path = `guilds/${interaction.guild.id}/members/${MemberNamesArr[i]}/referrals`
                // onValue(ref(db, path), (snapshot) => { 
                    let date = database.guilds[interaction.guild.id].members[MemberNamesArr[i]].referrals
                    if(date !== null) {
                        let ArrOfRefNames = Object.getOwnPropertyNames(date)
                        let RefPoints = 0
                            for (let y = 0; y < ArrOfRefNames.length; y++) {
                                // let path = `guilds/${interaction.guild.id}/members/${ArrOfRefNames[y]}/memberInfo`
                                
                                // onValue(ref(db, path), (snapshot) => { 
                                    let date = guilds[interaction.guild.id].members[ArrOfRefNames[y]].memberInfo
                                    RefPoints += Math.round((date.countOfActivityPoints/100)* referalPoints)

                                    if(y === ArrOfRefNames.length-1) {

                                        // let path = `guilds/${interaction.guildId}/members/${MemberNamesArr[i]}/memberInfo`
                                        
                                        // onValue(ref(db, path), (snapshot) => {
                                            let data = database.guilds[interaction.guildId].members[MemberNamesArr[i]].memberInfo
                                            database.guilds[interaction.guildId].members[MemberNamesArr[i]].memberInfo.countOfActivityPoints = RefPoints + data.countOfActivityPoints
                                            database.guilds[interaction.guildId].members[MemberNamesArr[i]].memberInfo.countOfActivityPoints = RefPoints
                                            WriteDB(database)
                                            // update(ref(db, path), {
                                            //     countOfActivityPoints:  RefPoints + data.countOfActivityPoints,
                                            //     countOfRefActivityPoints: RefPoints
                                            //   })
                                        // }, {onlyOnce: true}) 
                                    }
                                // }, {onlyOnce: true})
                            }
                    }
                // }, {onlyOnce: true})
            }
        }

        const createStr = () => {
                // let path = `guilds/${interaction.guild.id}/members`
                // onValue(ref(db, path), (snapshot) => { 
                    let date = database.guilds[interaction.guild.id].members

                    let UsersInfoArr =[]
                    for (const [key, value] of Object.entries(date)) {
                        UsersInfoArr = [...UsersInfoArr, value.memberInfo]
                    }

                    let ArrResult = []
                    for (let i = 0; i < UsersInfoArr.length; i++) {
                        ArrResult = [...ArrResult, {id: UsersInfoArr[i].id, COAP: UsersInfoArr[i].countOfActivityPoints, CORAP: UsersInfoArr[i].countOfRefActivityPoints}]
                    }

                    //filts
                    for (let i = 0; i < ArrResult.length; i++) {
                        for (let y = 0;y  < ArrResult.length; y++) {
                            if(ArrResult[i].COAP > ArrResult[y].COAP) {
                                let temp = ArrResult[i]
                                ArrResult[i] = ArrResult[y]
                                ArrResult[y] = temp
                            }
                        }
                    }

                    
                    let StrResult = ''
                    for (let i = 0; i < ArrResult.length; i++) {
                        if(i < TopCoun) 
                            StrResult += `${i+1}. <@${ArrResult[i].id}> - **${ArrResult[i].COAP}** (referral's: **${ArrResult[i].CORAP}**)\n`
                    }
                    sendEmnbed({
                        color: 'blue',
                        thumbnail: null,
                
                        russianTitle: `Top ${TopCoun}`,
                        russianDescription: StrResult,
                        russianFields: [],
                
                        englishTitle: `Top ${TopCoun}`,
                        englishDescription: StrResult,
                        englishFields: [],
                
                        author: null,                            
                        // timestamp: 'true',
                        footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                
                        guildId: interaction.guildId,
                        feedback: {
                          type: 'reply',
                          path: interaction,
                          ephemeral: false,
                        },
                    })
                    
                // }, {onlyOnce: true})
        }
        

        setTimeout(calcOwnPoints, 0, 'a')
        setTimeout(calcRefPoints, 0, 'b')
        setTimeout(createStr, 1000)
    // }, {onlyOnce: true})
// }, {onlyOnce: true}) 
}