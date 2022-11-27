export function currency(money:number){
    return `Rp.${money.toLocaleString("id-ID")}`
}