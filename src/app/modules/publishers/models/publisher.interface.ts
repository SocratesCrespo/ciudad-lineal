export interface Publisher {
    id?: string,
    firstname: string,
    lastname: string,
    publisherType: string,
    email: string,
    phone: string,
    whatsapp: string,
    description: string,
    address: string,
    territories: number[],
    history: History[]
}

// Version publica y minima de un publicador (coleccion 'publisherDirectory')
export interface PublisherDirectoryEntry {
    id: string,
    firstname: string,
    lastname: string
}

export interface Territory {
    number: number
}

export interface History{
    territory: number,
    date_init: string,
    date_end: string
}