import './control'
import Header from '../components/Header'
import NavNar from '../components/NavBar'
import NewsList from '../components/NewsList'
import PageLoading from '../components/PageLoading'
import MoreLoading from '../components/MoreLoading'

import { NEWS_TYPE } from '../data'
import { scrollToBottom, tplReplace } from '../lib/utils'

import service from '../service'
;((doc) => {
    const oApp = doc.querySelector('#app')!
    let oListWrapper:any = null
    let t: any = null

    const config = {
        type: 'top',
        count: 10,
        pageNum: 0,
        isLoading: false,
    }
    interface Res {
        [key: string]: {}
    }

    const newsData: Res = {}

    const init = async () => {
        render()
        await setNewsList()
        bindEvent()
    }

    function bindEvent() {
        NavNar.bindEvent(setType)
        NewsList.bindEvent(oListWrapper, setCurrentNews)
        window.addEventListener(
            'scroll',
            scrollToBottom.bind(null, getMoreList),
            false
        )
    }

    // 渲染
    function render() {
        const headerTpl = Header.tpl({
            url: '/',
            title: '新闻头条',
            showLeftIcon: false,
            showRightIcon: true,
        })

        const navBarTpl = NavNar.tpl(NEWS_TYPE)
        const listWrapper = NewsList.wrapperTpl(82)
        oApp.innerHTML += (headerTpl + navBarTpl + listWrapper)
        oListWrapper = oApp.querySelector('.news-list')
    }

    function renderList(data: any) {
        const { pageNum } = config
        const newsListTpl = NewsList.tpl({
            data,
            pageNum,
        })
        MoreLoading.remove(oListWrapper)
        oListWrapper.innerHTML += newsListTpl
        config.isLoading = false
        NewsList.imgShow()
    }

    async function setNewsList() {
        const {
            type,
            count,
            pageNum,
        }: 
        { 
            type: string,
            count: number,
            pageNum: number 
        } = config

        if (newsData[type]) {
            renderList((newsData[type] as Res)[pageNum])
            return
        }
        
        oListWrapper.innerHTML = PageLoading.tpl();
        let resultObj:any = await service.getNewsList(type, count)
        newsData[type] = resultObj
        service.getNewsList(type, count)
        setTimeout(() => {
            oListWrapper.innerHTML = ''
            renderList((newsData[type] as Res)[pageNum])
        }, 1500)
    }

    function setType(type: string) {
        config.type = type
        config.pageNum = 0
        config.isLoading = false
        oListWrapper.innerHTML = ''
        setNewsList()
    }

    function getMoreList() {
        if (!config.isLoading) {
            config.pageNum++
            clearTimeout(t)
            const { pageNum, type } = config
            if (newsData[type] && pageNum >= (newsData[type] as Res).length) {
                MoreLoading.add(oListWrapper, false)
            } else {
                config.isLoading = true
                MoreLoading.add(oListWrapper, true)
                t = setTimeout(() => {
                    setNewsList()
                }, 1000)
            }
        }
    }

    function setCurrentNews(options: any) {
        const { idx, pageNum } = options
        const currentNews = ((newsData[config.type] as Res)[pageNum] as Res)[
            idx
        ]
        if(!currentNews){
            return
        }
        localStorage.setItem('currentNews', JSON.stringify(currentNews))
    }

    init()
})(document)
