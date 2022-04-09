const tpl = require('./index.tpl')
import './index.less'

import { tplReplace } from '../../lib/utils'

export default {
    name: 'IFrame',
    tpl(url: string) {
        return tplReplace(tpl, {
            url,
        })
    },
}
