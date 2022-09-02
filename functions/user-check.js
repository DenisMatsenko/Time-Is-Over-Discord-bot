import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'
import sendEmnbed from './sendEmbed.js'

export default async function userCheck(guildId, userId, userName, guildName, client) {
    Log(client.guilds.cache.get(guildId), client.users.cache.get(userId), 'User Check')

    let path = `guilds/${guildId}/members/${userId}`
    onValue(ref(db, path), (snapshot) => {
      let data = snapshot.val();
      if(data === null) {
        CreateNewUser(path, userId, userName, client.guilds.cache.get(guildId).iconURL(), guildName, client, guildId)
      }
    }, {
        onlyOnce: true 
    })
}

const CreateNewUser = (path, userId, userName, guildIconUrl, guildName, client, guildId) => {
    Log(client.guilds.cache.get(guildId), client.users.cache.get(userId), 'Create new user')
    set(ref(db, `${path}/inventory`), {
        coins: 0,
        biscuits: 0,
    })

    set(ref(db, `${path}/referals`), {
        
    })

    set(ref(db, `${path}/memberMoneySystem`), {
        coins: 0,
        lastWorkTime: '01.01.2000',
        lastCrimeTime : '01.01.2000',
    })

    set(ref(db, `${path}/memberInfo`), {
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
    })

    sendEmnbed({
        color: 'blue',
        thumbnail: guildIconUrl,

        russianTitle:'Аккаунт был создан.',
        russianDescription: `Создан интерактивный аккаутн для сервера **${guildName}**`,
        russianFields: [],
        
        englishTitle: 'Account has been created',
        englishDescription: `Hello. Your interactive account for server **${guildName}** has been created.`,
        englishFields: [],

        author: null,
        //timestamp: true,
        footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },

        guildId: guildId, 
        feedback: {
          type: 'send',
          add: {client: client, guildId: guildId, memId: userId},
          path: 'path',
          ephemeral: false
        },
      }) 
}
