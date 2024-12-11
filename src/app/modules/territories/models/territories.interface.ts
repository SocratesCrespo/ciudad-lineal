export interface Territory{
    id?: string,
    number: number,
    description: string,
    history: TerritoryHistory[],
    type: string,
    map: string,
    publisher: string,
    publisher_id?: string,
    state: string,
    date_assigned: string,
    last_date: number
}

export interface TerritoryHistory{
    publisher: string,
    date_init: string,
    date_end: string
}