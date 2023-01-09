import DiscordJS, {EmbedBuilder} from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"

const Hour_for_notify = 10

export default async function NotifyTimerStart(client) {
    setInterval(() => {
        StartSendNotify()
    }, 1000)
}

const StartSendNotify = () => {
    if(new Date().getHours() == Hour_for_notify) {
        onValue(ref(db, 'Settings'), (snapshot) => { 
            let data = snapshot.val()
    
            console.log("data.LastNotifiDate: ",  data.LastNotifiDate)
            // console.log(`${new Date().getDate()}.${new Date().getMonth()+1}`)
    
    
            if(data.LastNotifiDate !== `${new Date().getDate()}.${new Date().getMonth()+1}` && data.TimeToSend == false) {
                console.log('here')
                update(ref(db, 'Settings'), {
                    TimeToSend: true,
                })
            }
        }, {onlyOnce: true})
    }
}



