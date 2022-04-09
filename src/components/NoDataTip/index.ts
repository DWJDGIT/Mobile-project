const tpl = require('./index.tpl')
import './index.less'
import { tplReplace } from '../../lib/utils'

export default {
  name: 'NoDataTip',
  tpl() {
    return tplReplace(tpl, {
      text: '您还没有收藏新闻'
    })
  }
}