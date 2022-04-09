const tpl = require('./index.tpl') 
import './index.less'
import { tplReplace } from '../../lib/utils'

export default {
  name: "Header",
  tpl(options:any){
    const { url, title, showLeftIcon, showRightIcon } = options
    return tplReplace(tpl, {
      url,
      title,
      showLeftIcon: showLeftIcon ? "block" : "none",
      showRightIcon: showRightIcon ? 'black' : 'none'
    })
  }
}


