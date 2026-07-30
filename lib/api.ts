import axios from "axios"
import { error } from "next/dist/build/output/log";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL||

export async function getAlerte_INCIDENTItems() : Promise<Alerte_INCIDENTItem> {
    try{
        const rep = await axios.get(`${API_BACKEND_URL}`)
        if (rep.status ===200) {
            return rep.data s Alerte_INCIEDNTItem;
        } else {
            throw new Error (`API Error : ${rep.status} ${rep.statusText}`)
        }
    } catch (Error) {
        if (axios.isAxiosError(Error)) {
            const message = "Axios Error:" + (Error.response? `${Error.response.status} ${Error.response.statusText}` : Error.message)
            throw new Error(message)
        }
    }
}


export async function getNotificationItems() : Promise<NotificationItem> {
    try{
        const rep = await axios.get(`${API_BACKEND_URL}`)
        if (rep.status ===200){
            return rep.data as NotificationItem;
        } else {
            throw new Error(`API Error : ${rep.status} ${rep.statusText}`)
        }
    } catch (Error) {
        if (axios.isAxiosError(Error)) {
            const message = "Axios Error: " + (error.response ? `${error.response.statusText}`: error.message)
            throw new Error(message)
        }
    }
}

export async function getAuditItems() : Promise<AuditItem> {
    try {
        const rep = await axios.get(`${API_BACKEND_URL}`)
        if (rep.status ===200) {
            return rep.data as AuditItem;
        } else {
            throw new Error(`API Error: ${rep.status} ${rep.statusText}`)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = "Axios Error : " + (error.response ? `${error.response.status} ${error.response.statusText}` : error.message)
            throw new Error(message)
        }
    }
}