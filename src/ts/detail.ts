import './control'
import NewsFrame from '../components/IFrame'
import Header from '../components/Header'
import Follow from '../components/Follow'
import { getUrlQueryValue } from '../lib/utils'
;((doc) => {
    const oApp = doc.querySelector('#app')!
    const currentNews = JSON.parse(localStorage.getItem('currentNews')!)
    const followedList = JSON.parse(
        localStorage.getItem('followedList') || '[]'
    )
    const init = () => {
        render()
        bindEvent()
    }

    function render() {
        const headerTpl = Header.tpl({
            url: getUrlQueryValue('path'),
            title: '新闻详情',
            showLeftIcon: true,
            showRightIcon: false,
        })
        const newsFrameTpl = NewsFrame.tpl(currentNews.url)
        const followTpl = creatFollowTpl()
        oApp.innerHTML += headerTpl + newsFrameTpl + followTpl
    }

    function bindEvent() {
        Follow.bindEvent(doFollow)
    }

    function doFollow(status: any) {
        let followedList = JSON.parse(
            localStorage.getItem('followedList') || '[]'
        )
        console.log(status)
        if (status) {
            followedList.push(currentNews)
        } else {
            followedList = followedList.filter(
                (item: any) => item.uniquekey !== currentNews.uniquekey
            )
        }
        localStorage.setItem('followedList', JSON.stringify(followedList))
    }
    function creatFollowTpl() {
        const isExist = followedList.find(
            (item: any) => item.uniquekey === currentNews.uniquekey
        )
        return isExist ? Follow.follow() : Follow.unfollow()
    }

    init()
})(document)
