import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

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
        privateRoomLimit: 15, 
        privateRoomStat: `unlock`,
        voiseChatConnectionTime: "none",
        voiseChatDisConnectionTime: "none",
    })

    let Embed = new EmbedBuilder()
    .setColor(0x3a60b5)
    // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
    .setTitle('Account has been created')
    .setDescription(`Hello. Your interactive account for server **${guildName}** has been created.`)
    .setThumbnail(guildIconUrl)
    .setTimestamp()
    .setFooter({ text: `Time is over from ${guildName}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });

    client.users.cache.get(userId).send({ embeds: [Embed] })
}
