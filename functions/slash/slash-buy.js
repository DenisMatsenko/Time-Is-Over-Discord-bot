import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

export default async function SlashBuy(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash buy')
    const numOfItem = options.getInteger('item')
    
    onValue(ref(db, `guilds/${interaction.guildId}/shop/${numOfItem - 1}`), (snapshot) => {
        let item = snapshot.val()

        if(item) {
            onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem/coins`), (snapshot) => {
                let money = snapshot.val()

                if(money >= parseInt(item.split('.')[2])) {
                    if (!interaction.member.roles.cache.some(role => role.id === item.split('.')[0])) {
                        let isError = false
                        client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id).roles.add(item.split('.')[0]).catch(error => {isError = true})
                        isError ? sendEmnbed({
                            color: 'red',
                            thumbnail: null,
                    
                            russianTitle: 'Что-то пошло не так, проверте разрешения бота!',
                            russianDescription: null,
                            russianFields: [],
                    
                            englishTitle: 'Something wrong, check bot permissions!',
                            englishDescription: null,
                            englishFields: [],
                    
                            author: null,
                            // timestamp: 'true',
                            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                    
                            guildId: interaction.guildId,
                            feedback: {
                              type: 'reply',
                              path: interaction,
                              ephemeral: true,
                        },}) : writeToDb(interaction, item, client)
                    }
                    else {
                        sendEmnbed({
                            color: 'red',
                            thumbnail: null,
                    
                            russianTitle: 'У вас уже есть эта роль!',
                            russianDescription: null,
                            russianFields: [],
                    
                            englishTitle: 'You already have this role!',
                            englishDescription: null,
                            englishFields: [],
                    
                            author: null,                            
                            //// timestamp: 'true',
                            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
                    
                            guildId: interaction.guildId,
                            feedback: {
                              type: 'reply',
                              path: interaction,
                              ephemeral: true
                            },
                        })

                    }
                }
                else {
                    sendEmnbed({
                        color: 'red',
                        thumbnail: null,
                
                        russianTitle: 'Недостаточно коинов!',
                        russianDescription: null,
                        russianFields: [],
                
                        englishTitle: 'You dont have enought coins!',
                        englishDescription: null,
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

                }
            }, {onlyOnce: true})
        }
        else {
            sendEmnbed({
                color: 'red',
                thumbnail: null,
        
                russianTitle: 'Неправильный номер!',
                russianDescription: null,
                russianFields: [],
        
                englishTitle: 'Wrong number!',
                englishDescription: null,
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

        }
    }, {onlyOnce: true})
}

const writeToDb = (interaction, item, client) => {
    onValue(ref(db, `guilds/${interaction.guildId}/timeRoles`), (snapshot) => {
        let data = snapshot.val()
        let index = 0
        if(data !== null) index = data.length

        const role = item.split('.')[0]
        const member = interaction.user.id
        const time = () => {
           let d =  new Date()
           return (d.getFullYear()*525960 +  d.getMonth() * 43800 + (d.getDate()+parseInt(item.split('.')[1])) * 1440 + d.getHours() * 60 + d.getMinutes())
        }

        update(ref(db, `guilds/${interaction.guildId}/timeRoles`), {
            [index]: `${time()}.${role}.${member}`
        })

        sendEmnbed({
            color: 'blue',
            thumbnail: null,
    
            russianTitle: 'Роль успешно добавлена!',
            russianDescription: null,
            russianFields: [],
    
            englishTitle: 'Role successfully purchased!',
            englishDescription: null,
            englishFields: [],
    
            author: null,            
            // timestamp: 'true',
            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
    
            guildId: interaction.guildId,
            feedback: {type: 'reply', path: interaction, ephemeral: true,},
        })
    }, {onlyOnce: true})
}