import DiscordJS, {EmbedBuilder} from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"

export default async function NotifyTimerStart(client) {
    setInterval(() => {
        StartSendNotify()



    }, 1000)
}

const StartSendNotify = () => {
    



    onValue(ref(db, 'Settings'), (snapshot) => { 
        let data = snapshot.val()

        console.log("data.LastNotifiDate: ",  data.LastNotifiDate)
        // console.log(`${new Date().getDate()}.${new Date().getMonth()+1}`)




        if(new Date().getHours() == 14 && data.LastNotifiDate !== `${new Date().getDate()}.${new Date().getMonth()+1}` && data.TimeToSend == false) {
            console.log('here')
            update(ref(db, 'Settings'), {
                TimeToSend: true,
            })
        }
    }, {onlyOnce: true})
}



