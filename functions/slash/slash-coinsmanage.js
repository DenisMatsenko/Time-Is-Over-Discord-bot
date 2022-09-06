import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import userCheck from '../user-check.js'

export default async function SlashCoinsManage(interaction, options, client)  {
    
    Log(interaction.guild, interaction.user, 'Slash coins manage')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const fun = options.getString('function')
        const user = options.getUser('user')
        const num =  options.getNumber('number')

        userCheck(interaction.guild.id, user.id, user.username, interaction.guild.name, client).then(() => {
            if(!user.bot && !user.system) {
                onValue(ref(db, `guilds/${interaction.guild.id}/members/${user.id}/memberMoneySystem`), async (snapshot) => {
                    let data = snapshot.val()
                    switch (fun) {
                        case 'Remove':
            
                            update(ref(db, `guilds/${interaction.guild.id}/members/${user.id}/memberMoneySystem`), {
                                coins: data.coins - num
                            })
                            break;
                        case 'Add':
            
                            update(ref(db, `guilds/${interaction.guild.id}/members/${user.id}/memberMoneySystem`), {
                                coins: data.coins + num
                            })
                            break;
                    }
            
                    sendEmnbed({
                        color: 'blue',
                        thumbnail: null,
                
                        russianTitle: `Баланс ${user.username} обновлен!`,
                        russianDescription: `Текущий баланс: ${fun === 'Add' ? data.coins + num : data.coins - num}.`,
                        russianFields: [],
                
                        englishTitle: `Coins of ${user.username} updated!`,
                        englishDescription: `Balance now: ${fun === 'Add' ? data.coins + num : data.coins - num}.`,
                        englishFields: [],
                
                        author: null,                            
                        // timestamp: 'true',
                        footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                
                        guildId: interaction.guildId,
                        feedback: {
                          type: 'reply',
                          path: interaction,
                          ephemeral: true,
                        },
                    }) 
            
            
                }, {onlyOnce: true})
            }
            else {
                sendEmnbed({
                    color: 'red',
                    thumbnail: null,
            
                    russianTitle: `Что-то не так :[`,
                    russianDescription: null,
                    russianFields: [],
            
                    englishTitle: `Something is wrong :[`,
                    englishDescription: null,
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
            }
        })

    }
    else {
        sendEmnbed({
            color: 'red',
            thumbnail: null,
    
            russianTitle: `Вы не администратор!`,
            russianDescription: null,
            russianFields: [],
    
            englishTitle: `You are not an administrator!`,
            englishDescription: null,
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
    }
}
