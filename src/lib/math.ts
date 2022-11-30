export function currency(money:number){
    return `Rp.${money.toLocaleString("id-ID")}`
}
export function telepon(telp:string){
    return `${telp.slice(0,4)}-${telp.slice(4,8)}-${telp.slice(8,12)}`
}