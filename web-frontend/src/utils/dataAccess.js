import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://yuyyujadubndgfpxauug.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eXl1amFkdWJuZGdmcHhhdXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NjA4MzUsImV4cCI6MjAzMzIzNjgzNX0.V8bBPKuA3fXB10LcA1inEJRDAv96y-ePQaNdpaKO0yo"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const id_comune_esempio = 2 //Milano

export async function getComunePosition() {
    const { data, error } = await supabase
        .from('comune')
        .select('*')
        .eq('codice_comune', id_comune_esempio);
    const comune = data[0]
    return [comune.lat, comune.long]
}

export async function getParkingAreas() {
    const { data, error } = await supabase
        .from('area_parcheggio')
        .select('*,punti_area_parcheggio(id,id_punto,id_area,lat,long)')
        .eq('id_comune', id_comune_esempio)
        .order('id_punto', { foreignTable: 'punti_area_parcheggio', ascending: true });

    const layers = []
    for (let area of data) {
        const newArea = {
            id: area.id,
            name: area.nome,
            leaflet_id: null,
            coordinates: area.punti_area_parcheggio.map((v) => [v.lat, v.long]),
        }
        layers.push(newArea)
    }
    return layers
}

//Ritorna un array con le tariffe del comune
export async function getTariffe() {
    const { data, error } = await supabase
        .from('tariffa')
        .select('id,nome,prezzo_orario(*)')
        .eq('id_comune', id_comune_esempio)
    return data
}

export async function removeAreaParcheggio(parking_area_id) {
    const {data, error} = await supabase
        .from('sensori')
        .update({id_area_parcheggio: null})
        .eq('id_area_parcheggio',parking_area_id )
    const response = await supabase
        .from('punti_area_parcheggio')
        .delete()
        .eq('id_area', parking_area_id)
    const response2 = await supabase
        .from('area_parcheggio')
        .delete()
        .eq('id', parking_area_id)
}

export async function createAreaParcheggio(parking_area_name, layer) {
    const { data, error } = await supabase
        .from('area_parcheggio')
        .insert({ id_comune: id_comune_esempio, nome: parking_area_name })
        .select();
    const idInserted = data[0].id;
    const rowsToInsert = layer.coordinates?.map((v, index) => {
        return { id_area: idInserted, id_punto: index, lat: v[0], long: v[1] }
    });
    const { data2, error2 } = await supabase
        .from('punti_area_parcheggio')
        .insert(rowsToInsert)
        .select();
}

export async function getPostiArea(id_area) {
    let { data: sensori, error } = await supabase
        .from('sensori')
        .select('numero_posto, stato')
        .eq('id_area_parcheggio', id_area)

    if (sensori)
        return { occupati: sensori.filter((x) => x.stato).length, totali: sensori.length }
    return { occupati: 0, totali: 0 }
}

export async function getSensoriLiberi() {
    let { data: sensoriLiebri, error } = await supabase
        .from('sensori')
        .select('*')
        .is('id_area_parcheggio', null);
    if (sensoriLiebri)
        return sensoriLiebri;
    return []
}

export async function assegnaSensore(id_area, id_sensore){
    const {data, error} = await supabase
        .from('sensori')
        .update({id_area_parcheggio: id_area})
        .eq('id', id_sensore)
}
