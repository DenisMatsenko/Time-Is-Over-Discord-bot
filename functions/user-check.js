import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import sendEmnbed from './sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../writeDB.js'

export default async function userCheck(guildId, userId, userName, guildName, client) {
    Log(client.guilds.cache.get(guildId), client.users.cache.get(userId), 'User Check')

    let path = `guilds/${guildId}/members/${userId}`

    let database = JSON.parse(fs.readFileSync('database.json'))


      if(!database.guilds[guildId].members[userId]) {
        CreateNewUser(database, userId, userName, client.guilds.cache.get(guildId).iconURL(), guildName, client, guildId)
      }

}

const CreateNewUser = (database1, userId, userName, guildIconUrl, guildName, client, guildId) => {
  
    Log(client.guilds.cache.get(guildId), client.users.cache.get(userId), 'Create new user')

    let database = JSON.parse(fs.readFileSync('database.json'))
  
    database.guilds[guildId].members[userId] = {
      ["inventory"]: {coins: 0, biscuits: 0,},
      ["memberMoneySystem"]: {coins: 0, lastWorkTime: '01.01.2000', lastCrimeTime: '01.01.2000'},
      ["memberInfo"]: {
        id: userId,
        name: userName,
        hasRefferal: false,
        timeInVoiceChat: 0,
        countOfTextMessages: 0,
        countOfActivityPoints: 0,
        countOfRefActivityPoints: 0,
        privateRoomName: `${userName}'s channel`,
        voiseChatConnectionTime: "none",
        voiseChatDisConnectionTime: "none",
      }
    }


    // database.guilds[guildId].members[userId].memberMoneySystem.coins = 0,
    // database.guilds[guildId].members[userId].memberMoneySystem.lastWorkTime = '01.01.2000',
    // database.guilds[guildId].members[userId].memberMoneySystem.lastCrimeTime = '01.01.2000',


    // database.guilds[guildId].members[userId].memberInfo.id = userId,
    // database.guilds[guildId].members[userId].memberInfo.name = userName,
    // database.guilds[guildId].members[userId].memberInfo.hasRefferal = false,
    // database.guilds[guildId].members[userId].memberInfo.timeInVoiceChat = 0,
    // database.guilds[guildId].members[userId].memberInfo.countOfTextMessages = 0,
    // database.guilds[guildId].members[userId].memberInfo.countOfActivityPoints = 0,
    // database.guilds[guildId].members[userId].memberInfo.countOfRefActivityPoints = 0,
    // database.guilds[guildId].members[userId].memberInfo.privateRoomName = `${userName}'s channel`,
    // database.guilds[guildId].members[userId].memberInfo.voiseChatConnectionTime = "none",
    // database.guilds[guildId].members[userId].memberInfo.voiseChatDisConnectionTime = "none",

    WriteDB(database)
    

    // set(ref(db, `${path}/inventory`), {
    //     coins: 0,
    //     biscuits: 0,
    // })

    // set(ref(db, `${path}/memberMoneySystem`), {
    //     coins: 0,
    //     lastWorkTime: '01.01.2000',
    //     lastCrimeTime : '01.01.2000',
    // })

    // set(ref(db, `${path}/memberInfo`), {
    //     id: userId,
    //     name: userName,
    //     hasRefferal: false,
    //     timeInVoiceChat: 0,
    //     countOfTextMessages: 0,
    //     countOfActivityPoints: 0,   
    //     countOfRefActivityPoints: 0,
    //     privateRoomName: `${userName}'s channel`,
    //     voiseChatConnectionTime: "none",
    //     voiseChatDisConnectionTime: "none",
    // })

    // sendEmnbed({
    //     color: 'blue',
    //     thumbnail: guildIconUrl,

    //     russianTitle:'Аккаунт был создан.',
    //     russianDescription: `Создан интерактивный аккаутн для сервера **${guildName}**`,
    //     russianFields: [],
        
    //     englishTitle: 'Account has been created',
    //     englishDescription: `Hello. Your interactive account for server **${guildName}** has been created.`,
    //     englishFields: [],

    //     author: null,
    //     //timestamp: true,
    //     footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },

    //     guildId: guildId, 
    //     feedback: {
    //       type: 'send',
    //       add: {client: client, guildId: guildId, memId: userId},
    //       path: 'path',
    //       ephemeral: false
    //     },
    //   }) 
}
