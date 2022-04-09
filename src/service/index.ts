import HTTP from '../lib/http'
import { setPageData } from '../lib/utils'

class Service extends HTTP {
  getNewsList(type:string, count:number){
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Juhe/getNewsList',
        type: 'POST',
        dataType: 'JSON',
        data: {
          field: type
        },
        success(data:any) {
          const pageData = setPageData(data.result.data, count)
          resolve(pageData)
        },
        error(err:any){
          reject(err)
        }
      })
    })
  }
}

export default new Service()