import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        scrollTop: 0
    },
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            this.getCateList();
        } else {
            if (Date.now() - Cates.time > 1000 * 300) {
                this.getCateList();
            } else {
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    async getCateList() {
        // request({ url: '/categories' })
        //     .then(result => {
        //         this.Cates = result.data.message;
        //         wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        //         let leftMenuList = this.Cates.map(v => v.cat_name);
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })
        //ES7 的 async await来发送请求
        const res = await request({ url: '/categories' });
        this.Cates = res;
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTap(e) {
        const { index } = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0
        })
    }
})