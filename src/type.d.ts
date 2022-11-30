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
export interface Search{
  totalItems:number
  items:{
    id:string
    name:string
    expand:{
      product:{
        name:string
        id:string
      }
    }
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
export interface Customer{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    updated:string
    id:string
    name:string
    address:string
    bought:number
  }[]
}
export interface Company{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    id:string
    name:string
    expand:{
      customer:{
        id:string
        name:string
        bought:number
        adress:string
      }
    }
  }[]
}
export interface Transaction{
  error?:number
  code?:number
  totalItems?:number
  items?:{
    created:string
    updated:string
    id:string
    full:boolean
    debt?:number
    due?:number
    telephone:string
    total:number
    product:string[]
    expand:{
      customer:{
        name:string
        id:string
        address:string
        bought:number
      },
      product:{
        total:number
        unit:number
        id:string
        expand:{
          product:{
            name:string
            id:string
          }
        }
      }[]
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
export interface InitialData{
  product:string,
  cart:string,
  debt:string
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
    telephone:string
    total:number
    product:string[]
    expand:{
      customer:{
        name:string
        id:string
        address:string
        bought:number
      }
    }
}