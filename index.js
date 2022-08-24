import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'

import userMessagePlus from './functions/user-message-plus.js'
import userCheck from './functions/user-check.js'
import roomsCreaterChack from './functions/rooms-creater-check.js'
import emptyRoomChack from './functions/empty-room-check.js'
import calcVoiceTime from './functions/calc-voice-time.js'
import roleIsOwer from './functions/role-is-ower.js'
 
import SlashTop from './functions/slash/slash-top.js'
// import SlashWallet from './functions/slash/slash-Wallet.js'
import SlashMyReferral from './functions/slash/slash-my-referral.js'
import SlashWork from './functions/slash/slash-work.js'
import SlashCrime from './functions/slash/slash-crime.js'
import SlashShop from './functions/slash/slash-shop.js'
import SwitchPage from './functions/switch-shop-page.js'
import SlashAddShopRole from './functions/slash/slash-add-shoprole.js'
import SlashDelShopRole from './functions/slash/slash-del-shoprole.js'
import SlashBuy from './functions/slash/slash-buy.js'
import SlashActive from './functions/slash/slash-active.js'
import SlashRoomLimit from './functions/slash/slash-room-limit.js'
import SlashRoomLock from './functions/slash/slash-room-lock.js'
import SlashRoomUnlock from './functions/slash/slash-room-unlock.js'
import SlashHug from './functions/interaction/slash-hug.js'
import SlasSendMsg from './functions/slash/slash-send-msg.js'
import SlashKiss from './functions/interaction/slash-kiss.js'

import {db} from "./firebase.js"
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import { async } from '@firebase/util'
import roomName from './functions/slash/slash-room-name.js'
import roomNameAnswer from './functions/slash/slash-room-name-answer.js'
import SlashPat from './functions/interaction/slash-pat.js'
import SlashSlap from './functions/interaction/slash-slap.js'
import SlashHit from './functions/interaction/slash-hit.js'
import SlashBite from './functions/interaction/slash-bite.js'
import SlashCry from './functions/interaction/slash-cry.js'
import SlashHelp from './functions/slash/slash-help.js'
import SlashSettings from './functions/slash/slash-settings.js'
import SlashSettingsReview from './functions/slash/slash-settings-review.js'



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
    console.log('Time is over is ready!!!')


    // onValue(ref(db, `Command`), async (snapshot) => {
    //   const data = snapshot.val();
    //   if(data !== null && data.item !== 'none') {
    //     console.log("data: ",  data)
    //     let ownerId = client.guilds.cache.get('919660235604508772').ownerId
    //     client.guilds.cache.get('919660235604508772').members.cache.get(ownerId).send('hh1')
    //   }
    // })

    setInterval(() => {
        roleIsOwer(client)      
    }, 3600000) 

    // let commands = client.application?.commands
    
    // const guildId = '919660235604508772'
    // const guild = client.guilds.cache.get(guildId)
    let commands 

    // if(guild) {
    //     commands = guild.commands
    // }
    // else {
    commands = client.application?.commands
    // }

    commands?.create({
        name: "settings",
        description: "ADMIN Bot settings",
        options: [
            {
                name: 'voice-manage-channel',
                description: 'set voice manage channel',
                type: DiscordJS.ApplicationCommandOptionType.Channel
            },
            {
                name: 'point-per-minute',
                description: 'set active point per one minute in voice channel',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'point-per-message',
                description: 'set active point per one message',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'chance-to-crime',
                description: 'set chance of a successful crime',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'crime-max',
                description: 'set max coins for successful crime',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'crime-min',
                description: 'set min coins for failed crime',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'crime-lost-min',
                description: 'set min loss coins for failed crime',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'crime-lost-max',
                description: 'set max loss coins for failed crime',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'work-max',
                description: 'set max coins for work',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
            {
                name: 'work-min',
                description: 'set min coins for work',
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
        ]
    })

    commands?.create({
        name: "settingsreview",
        description: "ADMIN Bot settings review",
    })

    commands?.create({
        name: "kiss",
        description: "kiss someone",
        options: [
            {
                name: 'user',
                description: 'kiss this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    })

    commands?.create({
        name: "bite",
        description: "bite someone",
        options: [
            {
                name: 'user',
                description: 'bite this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    })

    commands?.create({
        name: "hit",
        description: "hit someone",
        options: [
            {
                name: 'user',
                description: 'hit this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    })

    commands?.create({
        name: "pat",
        description: "pat someone",
        options: [
            {
                name: 'user',
                description: 'pat this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    })

    commands?.create({
        name: "slap",
        description: "slap someone",
        options: [
            {
                name: 'user',
                description: 'slap this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    })

    commands?.create({
        name: "cry",
        description: "cry",
    })

    commands?.create({
        name: 'help',
        description: "show all bot commands.",
    })

    commands?.create({
        name: "wallet",
        description: "Show your coins",
    })

    commands?.create({
        name: "roomlimit",
        description: "Change room members limit",
        options: [
            {
                name: 'limit',
                description: 'num of limit',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Integer
            },
        ],
    })

    commands?.create({
        name: "sendmsg",
        description: "ADMIN. Send message in embed!",
        options: [
            {
                name: 'title',
                description: 'title of embed',
                type: DiscordJS.ApplicationCommandOptionType.String
            },
            {
                name: 'description',
                description: 'description of embed',
                type: DiscordJS.ApplicationCommandOptionType.String
            },
            {
                name: 'image',
                description: 'image of embed',
                type: DiscordJS.ApplicationCommandOptionType.String
            },
        ],
    })

    commands?.create({
        name: "active",
        description: "Show your active",
    })

    commands?.create({
        name: "roomname",
        description: "Change name of youre room",
        // options: [
        //     {
        //         name: 'room-name',
        //         description: 'New name',
        //         required: true,
        //         type: DiscordJS.ApplicationCommandOptionType.String
        //     }
        // ]
    })

    commands?.create({
        name: "roomlock",
        description: "Lock your room",
    })

    commands?.create({
        name: "roomunlock",
        description: "Unlock your room",
    })

    commands?.create({
        name: "top",
        description: "Show top active people",
        // options: [
        //     {
        //         name: 'number',
        //         description: 'How many people will be in the top?',
        //         required: true,
        //         type: DiscordJS.ApplicationCommandOptionType.Number
        //     }
        // ]
    })



    //money system

    commands?.create({
        name: "buy",
        description: "buy role",
        options: [
            {
                name: 'item',
                description: 'num of role',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Integer
            },
        ],
    })

    commands?.create({
        name: "delshoprole",
        description: "ADMIN Del role from shop",
        options: [
            {
                name: 'item',
                description: 'num of role',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Integer
            },
        ],
    })

    commands?.create({
        name: "addshoprole",
        description: "ADMIN Add role to shop",
        options: [
            {
                name: 'role',
                description: 'none',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Role
            },
            {
                name: 'time',
                description: 'time in days',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Integer
            },
            {
                name: 'price',
                description: 'none',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Integer
            },
        ],
    })
    
    commands?.create({
        name: "work",
        description: "You can get money here",
    })

    commands?.create({
        name: "crime",
        description: "You can get money here or lost money",
    })

    commands?.create({
        name: "shop",
        description: "You can buy role on time here",
    })

    // guild.commands.fetch('1008022046963408926')
    // .then( (command) => {
    //     console.log(`Fetched command ${command.name}`)
    //     // further delete it like so:
    //     command.delete()
    //     console.log(`Deleted command ${command.name}`)
    //     }).catch(console.error);

    commands?.create({
        name: "hug",
        description: "Hug someone",
        options: [
            {
                name: 'user',
                description: 'Hug this user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    });
    
    commands?.create({
        name: "myreferral",
        description: "Set your referral",
        options: [
            {
                name: 'user',
                description: 'Account of the person who invited you',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
        ]
    });

    
})

client.on('interactionCreate', async (interaction) => {
    userCheck(interaction.guild.id, interaction.user.id, interaction.user.username, interaction.guild.name, client)

        let { commandName, options } = interaction

        if (interaction.type === InteractionType.MessageComponent) {
            if(interaction.customId === 'btnNext') {
                SwitchPage(interaction, options, client, 'next')
            }
            else if(interaction.customId === 'cancel') {
                interaction.message.delete()
            } 
            else if (interaction.customId === 'btnBack') {
                SwitchPage(interaction, options, client, 'back')
            }
        }

        if (interaction.type === InteractionType.ModalSubmit) { roomNameAnswer(interaction, options, client)}

        if(commandName === "help") { SlashHelp(interaction, options, client)}

        else if(commandName === "settings") { SlashSettings(interaction, options, client)}

        else if(commandName === "settingsreview") { SlashSettingsReview(interaction, options, client)}

        else if(commandName === "top") { SlashTop(interaction, options, client)}
        /////////////////
        else if(commandName === "hug") { SlashHug(interaction, options, client)}

        else if(commandName === "kiss") { SlashKiss(interaction, options, client)}

        else if(commandName === "bite") { SlashBite(interaction, options, client)}

        else if(commandName === "hit") { SlashHit(interaction, options, client)}

        else if(commandName === "pat") { SlashPat(interaction, options, client)}

        else if(commandName === "slap") { SlashSlap(interaction, options, client)}

        else if(commandName === "cry") { SlashCry(interaction, options, client)}
        ////////////////
        else if(commandName === "buy") { SlashBuy(interaction, options, client)}

        else if(commandName === "sendmsg") { SlasSendMsg(interaction, options, client)}

        else if(commandName === "roomlock") { SlashRoomLock(interaction, options, client)}

        else if(commandName === "roomunlock") { SlashRoomUnlock(interaction, options, client)}

        else if(commandName === "addshoprole") { SlashAddShopRole(interaction, options, client)}

        else if(commandName === "delshoprole") { SlashDelShopRole(interaction, options, client)}

        else if(commandName === "roomlimit") { SlashRoomLimit(interaction, options, client)}

        else if(commandName === "active") { SlashActive(interaction, options, client)}

        else if(commandName === "shop") { SlashShop(interaction, options, client)}

        else if(commandName === "work") { SlashWork(interaction, options, client)}

        else if(commandName === "crime") { SlashCrime(interaction, options, client)}

        else if(commandName === "roomname") { roomName(interaction, options, client)}

        // else if(commandName === "wallet") { SlashWallet(interaction, options, client)}

        else if(commandName === "myreferral") { SlashMyReferral(interaction, options, client)}    
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    userCheck(newState.guild.id, newState.id, newState.member.user.username, newState.guild.name, client)

    setTimeout(roomsCreaterChack, 100, oldState, newState)
    setTimeout(emptyRoomChack, 100, oldState, newState)
    setTimeout(calcVoiceTime, 1500, oldState, newState, new Date(), client)

    
})

client.on('guildCreate' , async (g) => {

    update(ref(db, `guilds/${g.id}/settings`), {
        voiceManageChannel: 'none',
        pointPerMsg: 1,
        pointPerMinute: 1.5,

        workGetMin: 10,
        workGetMax: 50,

        chanceCrime: 50,
        crimeGetMin: 10,
        crimeGetMax: 50,
        crimeLostMin: 50,
        crimeLostMax: 100,
    })

})

client.on('guildMemberAdd', async (a) => {
    userCheck(a.guild.id, a.user.id, a.user.username, a.guild.name, client)
})

client.on('messageCreate', async (message) => {
    if(!message.author.bot && !message.system && message.guildId !== null) {
        userCheck(message.guildId, message.author.id, message.author.username, message.guild.name, client)}
    setTimeout(userMessagePlus, 8000, message) //update user count fo text messages (DB)

        // let arr = [

        // ]

        // let shop = {}

        // let myDataName = '2';
        // let myDataValue = '8923829034902.20h.300$';
        // shop[myDataName] = myDataValue;
        
    if(message.content == 'aaa') {
        
        setTimeout(() => {
            onValue(ref(db, 'Command'), (snapshot) => { 
                message.reply(snapshot.val().item)
              }, {
                onlyOnce: true
              })
        }, 5000)
    } 


    // if(message.content == 'bbb') {
    //     let str = 'https://i.waifu.pics/E7cfJjs.gif https://i.waifu.pics/s~CLnmA.gif https://i.waifu.pics/puI2pTf.gif https://i.waifu.pics/QFGN4vE.gif https://c.tenor.com/XiYuU9h44-AAAAAM/anime-slap-mad.gif https://c.tenor.com/eU5H6GbVjrcAAAAC/slap-jjk.gif https://c.tenor.com/XqR-JFM-RgwAAAAC/anime-slap-dog.gif'
    //     let arr = str.split(' ')

    //     let path = `gifs/slap`

    //     for (let i = 0; i < arr.length; i++) {
    //         update(ref(db, path), {
    //             [i]: arr[i],
    //           })
    //     }


    // //     const exampleEmbed = new EmbedBuilder()
	// // .setColor(0x0099FF)
	// // .setTitle('Some title')
    // // .setImage("https://c.tenor.com/XREF0Th-UykAAAAM/anime-hug-hug.gif")   
    // // .setDescription('qwdqwd') 
    // // // <iframe src="https://giphy.com/embed/NVBR6cLvUjV9C" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="">via GIPHY</a></p>                                                                                        

    // // message.channel.send({ embeds: [exampleEmbed] });
    // }


    
    
    
 

     
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


client.login(process.env.token)
client.login('MTAwMjE1MTQ2MTg5MjkyNzUxMA.GmR5Qw.ndGqm3EwlddWrztBcTuvMCUzf7HWHnduAkOooM')