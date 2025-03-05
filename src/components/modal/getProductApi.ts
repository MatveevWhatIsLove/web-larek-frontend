import { Api, ApiListResponse, ApiPostMethods } from "../base/api"

import { IProductFull, IProductsFromApi } from "../../index";

// Получить данные карточек с сервера
export class getProductApi extends Api{

    baseSdn: string;

    constructor(baseUrl: string, options: RequestInit = {}, baseSdn : string){
        super (baseUrl, options);
        this.baseSdn = baseSdn;
    }

    getProdutList(): Promise<ApiListResponse<IProductFull>>{
        return this.get('/product/')
        .then((data: IProductsFromApi) =>{
            data.items.forEach((product)=>{
                product.image = this.baseSdn + product.image;
            })
            return data
        })
    }
}