export interface Product{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    category:string
    created:string
    updated:string
    id:string
    name:string
    price:number
    stock:number
  }[]
}
export interface Cart{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    id:string
    unit:number
    expand:{
      product:{
        id:string
        name:string
        price:number
        stock:number
      }
    }
  }[]
}
export interface Hystory{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    id:string
    created:string
    unit:number
    total:number
    expand:{
      product:{
        id:string
        name:string
        price:number
        stock:number
      }
    }
  }[]
}
export interface BackgroundPB{
  error?:number,
  code?:number,
  items?:{
    id:string,
    img:string
  }[]
}
export interface InitialData{
  product:string,
  cart:string,
  debt:string,
  background:string,
  header:string
}
export interface BuyData{
  product:string,
  cart:string
}
export interface TransactionOut{
  cart:string
  debt:string
}
export interface ModalData{
  name:string
  stock:number
  price:number
  id:string
  unit?:number
  cid?:string
  total?:number
}
export interface CustomerData{
  name:string
  total:number
  paid:number
  telp?:string
  due?:number
  adrress?:string
}
export interface DebtData{
  created:string
  updated:string
  id:string
  full:boolean
  debt?:number
  due?:number
  phone?:string
  address?:string
  customer:string
  total:number
  product:string[]
  expand:{
    product:{
      total:number
      unit:number
      id:string
      expand:{
        product:{
          name:string
          price:number
          id:string
        }
      }
    }[]
  }
}
export interface Transaction{
  error?:number
  code?:number
  totalItems?:number
  items?:DebtData[]
}
export interface LoginP {
  host: string;
  port: number;
}