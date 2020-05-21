import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 0,
                value: "销量",
                isActive: false
            },
            {
                id: 0,
                value: "价格",
                isActive: false
            }
        ],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    totalPages: 1,

    onLoad: function(options) {
        this.QueryParams.cid = options.cid || "";
        this.QueryParams.query = options.query || "";
        this.getGoodsList()
    },

    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });
        const total = res.total;
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        });
        wx.stopPullDownRefresh();
    },

    handletabItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        console.log(this.data.tabs);
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    onReachBottom() {
        if (this.QueryParams.pagenum >= this.totalPages) {
            wx.showToast({
                title: '没有下一页了'
            });
        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    onPullDownRefresh() {
        // 1 重置数组
        this.setData({
                goodsList: []
            })
            // 2 重置页码
        this.QueryParams.pagenum = 1;
        // 3 发送请求
        this.getGoodsList();
    }
})