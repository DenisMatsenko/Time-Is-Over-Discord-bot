import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'

import {db} from "./firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import { async } from '@firebase/util'



//////////////



const client = new DiscordJS.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildInvites,

        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions
    ]
})


client.on('ready', (client) => {
    console.log('The client is ready!!!')

    // onValue(ref(db, 'Command'), async (snapshot) => {  
    //     let data = snapshot.val()
    //     if(data.item !== 'none') {
    //         console.log("data: ",  data)
    //         client.channels.cache.get('919660235604508775').send('asd')
            
    //         // client.users.cache.get('538343406326513704').send('hi')
    //     }
    // }) 


    const guildId = '919660235604508772'
    const guild = client.guilds.cache.get(guildId)
    let commands

    if(guild) {
        commands = guild.commands
    }
    else {
        commands = client.application?.commands
    }

    commands?.create({
        name: "bag",
        description: "Show your bag",
    })

    commands?.create({
        name: "top",
        description: "Show top active people",
        options: [
            {
                name: 'number',
                description: 'How many people will be in the top?',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Number
            }
        ]
    })

    commands?.create({
        name: "setchannel",
        description: "none",
        options: [
            {
                name: 'channel',
                description: 'none',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Channel
            }
        ],
        
    })

    commands?.create({
        name: "getcode",
        description: "for login on site",
    }) 

    commands?.create({
        name: "myreferral",
        description: "Set your referral",
        options: [
            {
                name: 'user',
                description: 'Account of the person who invited you',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            }
        ]
    });
})

const UserCheck = (guildId, userId, userName, guildName) => {
    console.log('User check here!')
    let path = `guilds/${guildId}/members/${userId}`


    onValue(ref(db, path), (snapshot) => {
      let data = snapshot.val();
      if(data === null) {
        CreateNewUser(path, userId, userName, client.guilds.cache.get(guildId).iconURL(), guildName)
      }
    }, {
        onlyOnce: true 
    })
}

const CreateNewUser = (path, userId, userName, guildIconUrl, guildName) => {
    console.log('CreatNewUser here!')
    set(ref(db, `${path}/inventory`), {
        coins: 0,
        biscuits: 0,
    })

    set(ref(db, `${path}/referals`), {

    })

    set(ref(db, `${path}/memberInfo`), {
        id: userId,
        name: userName,
        hasRefferal: false,
        timeInVoiceChat: 0,
        countOfTextMessages: 0,
        countOfActivityPoints: 0,
        countOfRefActivityPoints: 0,
        voiseChatConnectionTime: "none",
        voiseChatDisConnectionTime: "none",
    })

    let Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
    .setTitle('Account has been created')
    .setDescription(`Hello. Your interactive account for server **${guildName}** has been created.`)
    .setThumbnail(guildIconUrl)
    .setTimestamp()
    .setFooter({ text: `Time is over from ${guildName}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });

    client.users.cache.get(userId).send({ embeds: [Embed] })
}

// const charControl = (string) => {
//     let arr = [...string]
//     for (let i = 0; i < arr.length; i++) {
//         if(arr[i] === '.' || arr[i] === '#' ||arr[i] === '$' ||arr[i] === '[' ||arr[i] === ']' ||arr[i] === ' ') {
//             arr[i] = '_'
//         }
//     }

//     return arr.join('')
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    


client.on('interactionCreate', async (interaction) => {
    console.log("interaction here!")

    UserCheck(interaction.guild.id, interaction.user.id, interaction.user.username, interaction.guild.name)
    // console.log("interaction: ",  interaction)

    let { commandName, options } = interaction

    if(commandName === "top") {
        let TopCoun = options.getNumber('number') 
        let path = `guilds/${interaction.guild.id}/members`
        onValue(ref(db, path), (snapshot2) => { 
            let date = snapshot2.val()
            let MemberNamesArr = Object.getOwnPropertyNames(date)


            const calcOwnPoints = (name) => {
                for (let i = 0; i < MemberNamesArr.length; i++) {
                    let path = `guilds/${interaction.guild.id}/members/${MemberNamesArr[i]}/memberInfo`
                    onValue(ref(db, path), (snapshot) => { 
                        let date = snapshot.val()
                        
                        update(ref(db, path), {
                            countOfActivityPoints: Math.round(date.countOfTextMessages*1 + date.timeInVoiceChat*1.5)
                        })
                        console.log(`${MemberNamesArr[i]} own points calculated ${name}`)
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
                                        RefPoints += date.countOfActivityPoints
                                        console.log(`scan ${MemberNamesArr[i]}, ${ArrOfRefNames[y]} has ${date.countOfActivityPoints}, all points now ${RefPoints}`)

                                        if(y === ArrOfRefNames.length-1) {
                                            console.log(`all ref points of ${MemberNamesArr[i]} in result = ${RefPoints}`)

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
                                StrResult += `${i+1}. <@${ArrResult[i].id}> - ${ArrResult[i].COAP}(${ArrResult[i].CORAP})\n`
                        }


                        let Embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        // .setAuthor({ name: `${interaction.user.username} ▪ bag`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
                        .setTitle(`Top ${TopCoun}`)
                        .setDescription(StrResult)
                        // .addFields(
                        //     { name: 'Coins 💰',    value: `${data.coins}`, inline: true },
                        //     // { name: 'Biscuits 🍪', value: `${data.biscuits}`, inline: true },
                        // )
                        .setTimestamp()
                        .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                        interaction.reply({ embeds: [Embed] })

                        
                    }, {onlyOnce: true})
            }
            

            setTimeout(calcOwnPoints, 0, 'a')
            setTimeout(calcRefPoints, 0, 'b')
            setTimeout(createStr, 1000)
        }, {onlyOnce: true})


    }

    if(commandName === "bag") {

        onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/inventory`), (snapshot) => {
            let data = snapshot.val();
            if(data !== null) {
                let Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.username} ▪ bag`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
                // .setTitle('You became a refer')
                // .setDescription(`<@${User.id}> is now your referral.`)
                .addFields(
                    { name: 'Coins 💰',    value: `${data.coins}`, inline: true },
                    // { name: 'Biscuits 🍪', value: `${data.biscuits}`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({  embeds: [Embed] })
            }
          }, {
            onlyOnce: true
          })
    }

    else if(commandName === "myreferral") {
        let User = options.getUser('user') 
        console.log(User)

        if(!User.bot && !User.system && interaction.guildId !== null) {
            console.log('norm')
            let path = `guilds/${interaction.guildId}/members/${User.id}`
            console.log(path) 
        
            onValue(ref(db, path), (snapshot) => {
              let data = snapshot.val();
              onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), (snapshot) => {
                let mydata = snapshot.val();
    
              console.log("data: ",  data)
              //exists checking
              if(data !== null && interaction.user.id != User.id && !mydata.hasRefferal) {
                set(ref(db, `${path}/referrals/${interaction.user.id}`), {
                    userName: interaction.user.username,
                    userId: interaction.user.id
                })

                update(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), {
                    hasRefferal: true,
                  })

                let Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('You became a refer')
                .setDescription(`<@${User.id}> is now your referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else if (data !== null && interaction.user.id != User.id && mydata.hasRefferal) {
                let Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`You already have a referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else if (data !== null && interaction.user.id == User.id) {
                let Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`You can't be your own referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else {
                let Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`<@${User.id}> doesn't have an interactive account.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
            }, {
                onlyOnce: true 
            })
            }, {
                onlyOnce: true 
            })
        } else {
            console.log('nenoerm')
            let Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
            .setTitle('Something is wrong :[')
            .setDescription(`Wrong account entered.`)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
            interaction.reply({ embeds: [Embed] })
        }


    }

    else if(commandName === "getcode") {

        try{
            if (interaction.member.permissions.has('ADMINISTRATOR')) {interaction.reply({
                content: 'ur code',
            })}
        }
        catch {
            interaction.reply('no')
        }
        
    }

    else if(commandName === 'setchannel') {
        const channel = options.getChannel('channel')
        console.log("channel.id: ",  channel.id)
        let path = `guilds/${interaction.guild.id}/privateRooms`
        update(ref(db, path), {
            channelIdForCreate: channel.id,
        })
    }
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    UserCheck(newState.guild.id, newState.id, newState.member.user.username, newState.guild.name)

    
    //проверка на рум криейт
    const roomsCreateChack = () => {onValue(ref(db, `guilds/${newState.guild.id}/privateRooms`), async (snapshot) => {
        let data = snapshot.val()
        if(newState.channelId == data.channelIdForCreate) {
            const channel = await newState.guild.channels.create({
                name: `${newState.member.user.username}'s channel`,
                type: 2, 
                parent: newState.channel.parent,
                permissionOverwrites: [{
                    id: newState.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.Connect],              
                }]
            })

            newState.member.voice.setChannel(channel)

            const arrRoom = () => {
                let rooms = []
                if(data.rooms) {
                    rooms = [ ...data.rooms, channel.id]
                }
                else {
                    rooms = [channel.id]
                }
                update(ref(db, `guilds/${newState.guild.id}/privateRooms`), {
                    rooms
                })
            }
            arrRoom()

        }
    }, {onlyOnce: true})}
    

    //проверка на емпту рум
    const emptyCheck = () => {onValue(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms`), async (snapshot) => {

        console.log("oldState: ",  oldState.channelId)
        console.log("newState: ",  newState.channelId)

        let rooms = snapshot.val()
        if(rooms !== null && oldState !== null) {
            for (let i = 0; i < rooms.length; i++) {
                console.log("rooms[i]: ",  rooms[i])
                if(oldState.channelId === rooms[i]) {
                    if(Array.from(oldState.channel.members).length === 0) {
                        oldState.channel.delete()
                        remove(ref(db, `guilds/${newState.guild.id}/privateRooms/rooms/${i}`))
                    }
                    
                }
            }
        }
    }, {onlyOnce: true})}

    setTimeout(roomsCreateChack, 0)
    setTimeout(emptyCheck, 100)




    let d = new Date()
    setTimeout(vcct, 1500, oldState, newState, d)
})

const vcct = async (oldMember, newMember, d)  => {
    if(oldMember.channelId == null && newMember.channelId !== null) {
        console.log('Connected')
        
        let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
        console.log("Connected path: ",  path)

        update(ref(db, path), {
            voiseChatConnectionTime: `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`,
            voiseChatDisConnectionTime: 'none'
          })
    }
    else if(oldMember.channelId !== null && newMember.channelId == null) {
        console.log('Disconnected') 

        let path = `guilds/${newMember.guild.id}/members/${newMember.id}/memberInfo`
        console.log("Disconnected path: ",  path)

        onValue(ref(db, path), (snapshot) => { 
            let data = snapshot.val();
            let diffrence = 0
            if(data.voiseChatConnectionTime !== 'none') {
                let temp = data.voiseChatConnectionTime
                console.log(data.voiseChatConnectionTime)
                    let oldHours = temp.split(':')[0]
                    let oldMinutes  = temp.split(' ')[0].split(':')[1]
                    let oldDays = temp.split(' ')[1].split('.')[0]
                    let oldMonth = temp.split(' ')[1].split('.')[1]
                    let oldYears = temp.split(' ')[1].split('.')[2]
    
                    let oldDate = (parseInt(oldYears)* 525960 + (parseInt(oldMonth)-1)*43800 + parseInt(oldDays)*1440 + parseInt(oldHours)*60 + parseInt(oldMinutes))
                    let newDate = (d.getFullYear()*525960 +  d.getMonth() * 43800 + d.getDate() * 1440 + d.getHours() * 60 + d.getMinutes())
                    
                    diffrence = newDate-oldDate
                    console.log("diffrence: ",  diffrence)
            }


                update(ref(db, path), {
                    timeInVoiceChat: data.timeInVoiceChat + diffrence,
                    voiseChatConnectionTime: 'none',
                    voiseChatDisConnectionTime:  `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`
                })
          }, {
            onlyOnce: true
          })


        // update(ref(db, path), {
        //     voiseChatConnectionTime: 'none',
        //     voiseChatDisConnectionTime:  `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`
        //   })
    }
}

client.on('guildMemberAdd', async (a) => {
    UserCheck(a.guild.id, a.user.id, a.user.username, a.guild.name)
})

// client.on('userUpdate', async (oldUser, newUser) => {
//     if(!newUser.bot && !newUser.bot) {
//         path = `guilds`
//         onValue(ref(db, path), async (snapshot) => {  
//             let data = snapshot.val();
    
//             console.log(count)
//         }, {
//             onlyOnce: true
//         }) 
//     }
// })

client.on('messageCreate', async (message) => {
    //db add!
    if(message.content !== '' && !message.author.bot && !message.author.system) {
        let path = `guilds/${message.guild.id}/members/${message.author.id}/memberInfo`
        let count = 0
            onValue(ref(db, path), async (snapshot) => {  
                let data = snapshot.val();
                if(data === null) {
                    UserCheck(message.guildId, message.author.id, message.author.username, message.guild.name)
                } 
                else if(!message.author.bot && data !== null) {
                    update(ref(db, path), {
                        countOfTextMessages:  parseInt(data.countOfTextMessages) + 1
                    }) 
                }
                console.log(count)
            }, {
                onlyOnce: true
            }) 
    }
        
    if(message.content == 'aaa') {
        let cnl = Array.from(client.channels.cache.get('919660235604508777').members).length
        console.log("cnl: ",  cnl)
    } 
 

    
    // message.author.send(message.content).catch(error => {console.log(`error: ${error.code}`)})  
    // console.log("messmessage.author.id: ",  message.author.id)
    // console.log("message.channel: ",  message.channel.id)
    // console.log("message.content: ",  message.content)
    // console.log("")
    // console.log("message: ",  message)

    

    // client.channels.cache.get('766828397292290069').send('bobo');


    // --------WRITE TO DB-----------
    // set(ref(db, message.id), {
    //     guild: message.guild.id,
    //     autor: message.author.id,
    //     text: message.content,
    //   })


    ///read db
    // let path = email.split('@')[0] + "-" + email.split('@')[1].split('.')[0] + "-" + email.split('@')[1].split('.')[1] + "/UserTasks"

    // onValue(ref(db, path), (snapshot) => {
    //   const data = snapshot.val();
    //   if(data !== null) {
    //     setAllPosts(Object.values(data))
    //   }
    // })

    // if(message.content === 'change') {
    //     client.guilds.cache.get(message.guildId).roles.cache.get('1004502958504935424').setColor('#800b0f')


        
    //     message.reply({
    //         content: client.guilds.cache.get(message.guildId).roles.cache.get('1004502958504935424').hexColor
    //     })
    // }

    // if(message.content === 'create') {
    //     client.guilds.cache.get(message.guildId).roles.create({
    //         name: 'super role',
    //         color: '#3498db',
    //         position: 4,
    //         hoist: true,
    //     })


        
    //     message.reply({
    //         content: 'created'
    //     })
    // }


    // if(message.content === 'time') {
        
    //     message.reply(charControl(message.author.username))
    // }


    // if(message.content === 'go bot') {
    //     // const aaa =  client.guilds.cache.get(message.guildId).roles.cache.array()
    //     const roles = [];
    //     client.guilds.cache.get(message.guildId).roles.cache.forEach((role) => {
    //         roles.push({
    //             name: role.name,
    //             id: role.id,
    //             rp: role.rawPosition
    //         })  
    //     })

    //     console.log(roles)
        
        
    //     message.reply({
    //         content: client.guilds.cache.get(message.guildId).iconURL()
    //     })
    // }
})


client.login(process.env.TOKEN) 