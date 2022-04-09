const tpl = require('./index.tpl') 
import './index.less'
import { tplReplace } from '../../lib/utils'

export default {
  name: 'MoreLoading',
  _tpl(isLoading:boolean){
    return tplReplace(tpl, {
      isLoading: isLoading ? 'loading' : '',
      text: isLoading ? '正在加载更多' : '没有更多新闻了'
    })
  },
  remove(oList:HTMLElement) {
    const oMoreLoading = oList.querySelector('.more-loading')
    oMoreLoading && oMoreLoading.remove()
  },
  add(oList:HTMLElement, isLoading:boolean){
    const oMoreLoading = oList.querySelector('.more-loading')
    if(!oMoreLoading){
      oList.innerHTML += this._tpl(isLoading)
    }
  }
}

