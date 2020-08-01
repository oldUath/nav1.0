const $siteList = $('.siteList');
const $lastLi = $('.siteList').find('.last');
//读取上一次关闭窗口存储的数据,parse是把字符串转换成对象
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
// 如果第一次灭有xObject,则构建一个数据结构，把连接等数据存储到里面
const hashMap = xObject || [
    { logo: 'B', url: 'https://www.bilibili.com/' },
    { logo: 'F', url: 'http://f2er.club/' },
    { logo: 'J', url: 'https://juejin.im/' },
    { logo: 'D', url: 'https://dytiger.github.io/index.html' }
];

const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')//  /\/.*/是正则表达式，删除/开头的东西，\是转义
}

//渲染hashMap函数
const render = () => {
    //先移除已经存在的节点，否则会出现重复
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index) => {
        const $li = $(`
    <li>
        <div class="site">
            <div class="logo">
                <div class="logo">${node.logo[0]}</div>
            </div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
                <svg class="icon">
                    <use xlink:href="#icon-cc-close-crude"></use>
                </svg>
            </div>
        </div>
    </li>
    `).insertBefore($lastLi)
        $li.on('click', () => {
            // 代替a标签，跳转
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {
            // 阻止冒泡
            e.stopPropagation()
            // 根据下表删除,只删除一个
            hashMap.splice(index, 1)
            render()
        })
    });
}
render();


$('.addButton').on('click', (e) => {
    let url = prompt('请输入网址')
    if (url.indexOf('https://') !== 0 && url.indexOf('http://') !== 0) {
        url = 'https://' + url
    }
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    })

    render();

});


window.onbeforeunload = () => {
    //把对象变成字符串
    const string = JSON.stringify(hashMap)
    // localStorage是全局变量，把数据string存入到一个键里（x）
    localStorage.setItem('x', string)
}

$(document).on('keypress', (e) => {
    const { key } = e
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
})