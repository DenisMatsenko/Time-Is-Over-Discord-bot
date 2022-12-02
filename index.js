import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageActivityType  } from 'discord.js'

import userMessagePlus from './functions/user-message-plus.js'
import userCheck from './functions/user-check.js'
import roomsCreaterChack from './functions/rooms-creater-check.js'
import emptyRoomChack from './functions/empty-room-check.js'
import calcVoiceTime from './functions/calc-voice-time.js'
import roleIsOwer from './functions/role-is-ower.js'
 
import SlashTop from './functions/slash/slash-top.js'
import SlashWallet from './functions/slash/slash-wallet.js'
import SlashMyReferral from './functions/slash/slash-my-referral.js'
import SlashWork from './functions/slash/slash-work.js'
import SlashCrime from './functions/slash/slash-crime.js'
import SlashShop from './functions/slash/slash-shop.js'
import SwitchPage from './functions/switch-shop-page.js'
import SlashAddShopRole from './functions/slash/slash-add-shoprole.js'
import SlashDelShopRole from './functions/slash/slash-del-shoprole.js'
import SlashBuy from './functions/slash/slash-buy.js'
import SlashActive from './functions/slash/slash-active.js'
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
import RoomDeleteCheck from './functions/room-delete-check.js'
import Log from './functions/log.js'
import SlashCreateVoiceMan from './functions/slash/slash-cratevoiceman.js'

import sendEmnbed from './functions/sendEmbed.js'
import SlashCoinsManage from './functions/slash/slash-coinsmanage.js'
import * as fs from 'fs'
import WriteDB from './writeDB.js'
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

    onValue(ref(db, "database"), (snapshot) => { 
        WriteDB(snapshot.val())
    }, {onlyOnce: true})


    console.log('Time is over is ready!!!')


        let Embed = new EmbedBuilder()
        .setTitle('Time is over turned on!')
        .setThumbnail(client.user.avatarURL())
        .setAuthor({name: `${client.user.username} ▪ Turn on`, iconURL: client.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q'})
        .setTimestamp()

        if(client.user.id === '1002151461892927510')
        client.users.fetch('538343406326513704').then((user) => {user.send({ embeds: [Embed] })})



    let d = new Date()
    let date = `${d.getHours()+2}:${d.getMinutes()} ${d.getDate()}:${d.getMonth()+1}:${d.getFullYear()}`
    let datecode = (d.getFullYear()*525960 +  d.getMonth() * 43800 + d.getDate() * 1440 + d.getHours() * 60 + d.getMinutes())


    //////////////////////////////////////////////////////////////////////
 
    setInterval(() => {
        roleIsOwer(client)
    }, 1800000)

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
                name: 'bot-language',
                description: 'set bot language',
                choices: [{name:'English', value:'English'}, {name:'Russian', value:'Russian'}],
                type: DiscordJS.ApplicationCommandOptionType.String
            },
            {
                name: 'referal-points',
                description: 'set % from referal points',
                type: DiscordJS.ApplicationCommandOptionType.Number
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
        name: "createvoisemanagement",
        description: "ADMIN create voice & text channel for room management",
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

    // client.application.commands.fetch('1012725832436957184')
    // .then( (command) => {
    //     console.log(`Fetched command ${command.name}`)
    //     // further delete it like so:
    //     command.delete()
    //     console.log(`Deleted command ${command.name}`)
    //     }).catch(console.error);

    commands?.create({
        name: "coinsmanage",
        description: "ADMIN add or remove coins to special member",
        options: [
            {
                name: 'function',
                description: 'add or remove',
                required: true,
                choices: [{name:'Add', value:'Add'}, {name:'Remove', value:'Remove'}],
                type: DiscordJS.ApplicationCommandOptionType.String
            },
            {
                name: 'user',
                description: 'Special user',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.User
            },
            {
                name: 'number',
                description: 'How many coins',
                required: true,
                type: DiscordJS.ApplicationCommandOptionType.Number
            },
        ]
    });

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
    if(interaction.guild !== null) {
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



            else if (interaction.customId === 'roomname') {
                roomName(interaction, options, client)
            } 
            else if (interaction.customId === 'roomlock') {
                SlashRoomLock(interaction, options, client)
            } 
            else if (interaction.customId === 'roomunlock') {
                SlashRoomUnlock(interaction, options, client)
            } 

        }

        if (interaction.type === InteractionType.ModalSubmit) { roomNameAnswer(interaction, options, client)}

        if(commandName === "help") { SlashHelp(interaction, options, client)}

        else if(commandName === "coinsmanage") { SlashCoinsManage(interaction, options, client)}

        else if(commandName === "settings") { SlashSettings(interaction, options, client)}

        else if(commandName === "createvoisemanagement") { SlashCreateVoiceMan(interaction, options, client)}

        else if(commandName === "settingsreview") { SlashSettingsReview(interaction, options, client)}

        else if(commandName === "top") {
            sendEmnbed({
                color: 'red',
                thumbnail: null,
        
                russianTitle: `Пока эта комманда не работает..`,
                russianDescription: `Скоро будет готово!`,
                russianFields: [],
        
                englishTitle: `While this command does not work..`,
                englishDescription: `Will be ready soon!`,
                englishFields: [],
        
                author: null,                            
                //// timestamp: 'true',
                footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
        
                guildId: interaction.guildId,
                feedback: {
                  type: 'reply',
                  path: interaction,
                  ephemeral: false,
                },
            })
            //  SlashTop(interaction, options, client)
        }
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

        else if(commandName === "wallet") { SlashWallet(interaction, options, client)}

        else if(commandName === "myreferral") { SlashMyReferral(interaction, options, client)}   
    } else {
        const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Slash commands only on servers!')
        .setTimestamp()
        .setFooter({ text: 'Time is over', iconURL: 'https://cdn.discordapp.com/attachments/1006251207578361948/1012727195380236308/e2c999dc25c3f9552ec86031eaaffbf6.jpg' });
    
        interaction.user.send({embeds: [Embed]})
    }
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    if(!oldState.member.user.bot && !newState.member.user.bot) {
        userCheck(newState.guild.id, newState.id, newState.member.user.username, newState.guild.name, client)
 
        setTimeout(roomsCreaterChack, 100, oldState, newState)
        setTimeout(emptyRoomChack, 100, oldState, newState)
        setTimeout(calcVoiceTime, 1500, oldState, newState, new Date(), client)
    }
})

client.on('channelDelete', async (channel) => {
    RoomDeleteCheck(channel)
})


client.on('guildCreate' , async (guild) => {
    Log(guild, "TIO BOT", 'Guild Create')

    let database = JSON.parse(fs.readFileSync('database.json'))

    Object.assign(database.guilds, {[guild.id]: {settings: {
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
        language: 'English',
        referalPoints: 20,
    }}})
    WriteDB(database)


    const Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Hello, Time is over is here!')
    .setURL('https://discord.gg/rEeW7Rs92q')
    // .setAuthor({ name: 'Time is over', iconURL: 'https://cdn.discordapp.com/attachments/1006251207578361948/1012727195380236308/e2c999dc25c3f9552ec86031eaaffbf6.jpg', url: 'https://discord.gg/rEeW7Rs92q' })
    .setDescription(`
        I can help automate the economy, private rooms management, track members activity, members interactions and improve the communication experience.

        Visit **Time is over support server** (link below), there will be published news and polls on my improvement!

        Feature information - ***/help***
        Time is over settings - ***/settitngs***
        Support, Q&A, suggestions - https://discord.gg/rEeW7Rs92q`
    )
    // .setThumbnail('https://i.imgur.com/AfFp7pu.png')

    .setImage('https://i.ibb.co/d00r8Rs/pp.jpg')
    .setTimestamp()
    .setFooter({ text: 'Time is over', iconURL: client.user.displayAvatarURL() });

    guild.systemChannel.send({embeds: [Embed]})
})

client.on('guildMemberAdd', async (a) => {
    userCheck(a.guild.id, a.user.id, a.user.username, a.guild.name, client)
})

client.on('messageCreate', async (message) => {
    if(!message.author.bot && !message.system && message.guildId !== null) {
        userCheck(message.guildId, message.author.id, message.author.username, message.guild.name, client)}
    setTimeout(userMessagePlus, 8000, message)
     //update user count fo text messages (DB)
})

client.login(process.env.token)
