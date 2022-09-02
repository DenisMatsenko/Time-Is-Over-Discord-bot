import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

export default function SlashTop(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slas top')
    // let TopCoun = options.getNumber('number') 
    let TopCoun = 15
    let path = `guilds/${interaction.guild.id}/members`

    onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
        const pointPerMsg = snapshot.val().pointPerMsg
        const pointPerMinute = snapshot.val().pointPerMinute
    

    onValue(ref(db, path), (snapshot2) => { 
        let date = snapshot2.val()
        let MemberNamesArr = Object.getOwnPropertyNames(date)


        const calcOwnPoints = (name) => {
            for (let i = 0; i < MemberNamesArr.length; i++) {
                let path = `guilds/${interaction.guild.id}/members/${MemberNamesArr[i]}/memberInfo`
                onValue(ref(db, path), (snapshot) => { 
                    let date = snapshot.val()
                    
                    update(ref(db, path), {
                        countOfActivityPoints: Math.round(date.countOfTextMessages*pointPerMsg + date.timeInVoiceChat*pointPerMinute)
                    })
                }, {onlyOnce: true})
            }
        }

        const calcRefPoints = (name) => {   
            for (let i = 0; i < MemberNamesArr.length; i++) {
                let path = `guilds/${interaction.guild.id}/members/${MemberNamesArr[i]}/referrals`
                onValue(ref(db, path), (snapshot) => { 
                    let date = snapshot.val()
                    if(date !== null) {
                        let ArrOfRefNames = Object.getOwnPropertyNames(date)
                        let RefPoints = 0
                            for (let y = 0; y < ArrOfRefNames.length; y++) {
                                let path = `guilds/${interaction.guild.id}/members/${ArrOfRefNames[y]}/memberInfo`
                                onValue(ref(db, path), (snapshot) => { 
                                    let date = snapshot.val()
                                    RefPoints += Math.round((date.countOfActivityPoints/100)*20)

                                    if(y === ArrOfRefNames.length-1) {

                                        let path = `guilds/${interaction.guildId}/members/${MemberNamesArr[i]}/memberInfo`
                                        onValue(ref(db, path), (snapshot) => {
                                            let data = snapshot.val()
                                            update(ref(db, path), {
                                                countOfActivityPoints:  RefPoints + data.countOfActivityPoints,
                                                countOfRefActivityPoints: RefPoints
                                              })
                                        }, {onlyOnce: true}) 
                                    }
                                }, {onlyOnce: true})
                            }
                    }
                }, {onlyOnce: true})
            }
        }

        const createStr = () => {
                let path = `guilds/${interaction.guild.id}/members`
                onValue(ref(db, path), (snapshot) => { 
                    let date = snapshot.val()

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
                }, {onlyOnce: true})
        }
        

        setTimeout(calcOwnPoints, 0, 'a')
        setTimeout(calcRefPoints, 0, 'b')
        setTimeout(createStr, 1000)
    }, {onlyOnce: true})
}, {onlyOnce: true}) 
}